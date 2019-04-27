import Mustache from "mustache";
import Chooser from "random-seed-weighted-chooser";

let defaultCore: Object = {
  capitalize: (): Function => {
    return (text: string, render: Function): string => {
      let renderedText = render(text);
      return renderedText.charAt(0).toUpperCase() + renderedText.slice(1);
    };
  },
  choose: (): Function => {
    return (text: string, render: Function): string => {
      let segments = text.split("|");
      let segmentsWithWeights: any = [];
      let regex: RegExp = /(.*)[=](\d+)/;
      segments.forEach(segment => {
        let match: RegExpMatchArray | null = segment.match(regex);
        if (match !== null && match.length >= 2) {
          segmentsWithWeights.push({
            value: match[1],
            weight: parseInt(match[2])
          });
        } else {
          segmentsWithWeights.push({ value: segment, weight: 1 });
        }
      });
      let chosen: any = Chooser.chooseWeightedObject(segmentsWithWeights);
      let renderedText: string = render(chosen.value);
      return renderedText;
    };
  }
};

export default class Persona {
  constructor(public vocab: Object = {}, public core: Object = defaultCore) {}

  articulate = (template: string, params = {}): string => {
    let coreToUse: any = { ...this.core, params: { ...params } };
    let vocabToUse: any = this.vocab;

    let result = Mustache.render(template, coreToUse, vocabToUse);

    // See if they just provided the name of a partial with no curly braces.
    // If so, wrap it in curly braces and attempt to render the partial.
    if (
      result === template &&
      result.indexOf("{{") < 0 &&
      result.indexOf("}}") < 0
    ) {
      let partial = `{{>${template}}}`;
      let resultUsingPartial = Mustache.render(
        `{{>${template}}}`,
        coreToUse,
        vocabToUse
      );
      if (resultUsingPartial !== "" && resultUsingPartial !== partial) {
        result = resultUsingPartial;
      }
    }

    return result;
  };
}

interface WeightedVocab {
  v: string;
  w: number;
}

export class VocabHelpers {
  static capitalize = (text: string): string => {
    return "{{#capitalize}}" + text + "{{/capitalize}}";
  };

  static choose = (texts: (string | WeightedVocab)[]): string => {
    let parts = texts.map(val => {
      if (typeof val === "string") {
        return val;
      } else {
        return val.v + "=" + val.w;
      }
    });
    return "{{#choose}}" + parts.join("|") + "{{/choose}}";
  };
}
