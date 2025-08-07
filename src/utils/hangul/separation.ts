/**
 * 한글 자모 분리 결과를 담는 클래스입니다.
 *
 * 입력된 한글 문자열을 초성, 중성, 종성으로 분리하여 각각 자음, 모음 리스트로 제공합니다.
 * 한글 음절이 아닌 영어, 숫자, 특수문자는 버려집니다.
 *
 * @see HangulUtil#separateHangulToJamo(String)
 */
export class HangulSeparationResult {
  /**
   * 분리된 자음 문자열 리스트입니다.
   *
   * 종성이 없는 음절의 경우 빈 문자열이 포함됩니다.
   *
   * 예: "안녕하세요" -> ["ㅇ", "ㄴ", "ㄴ", "ㅇ", "ㅎ", "", "ㅅ", "", "ㅇ", ""]
   */
  public readonly consonants: string[];

  /**
   * 분리된 모음 문자열 리스트입니다.
   *
   * 한글 음절의 중성이 순서대로 포함됩니다.
   *
   * 예: "안녕하세요" -> ["ㅏ", "ㅕ", "ㅏ", "ㅔ", "ㅛ"]
   */
  public readonly vowels: string[];

  /**
   * HangulSeparationResult의 새 인스턴스를 생성합니다.
   *
   * @param consonants 분리된 자음 리스트
   * @param vowels     분리된 모음 리스트
   */
  constructor(consonants: string[], vowels: string[]) {
    this.consonants = consonants;
    this.vowels = vowels;
  }

  public toString(): string {
    return `HangulSeparationResult{consonants=${this.consonants}, vowels=${this.vowels}}`;
  }
}

// 초성 리스트 (총 19개)
export const FIRST_CONSONANT = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

// 중성 리스트 (총 21개)
export const MIDDLE_VOWEL = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";

// 종성 리스트 (첫 번째는 종성 없음, 총 28개)
export const LAST_CONSONANT =
  " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

// 초성으로만 올 수 있는 자음
export const ONLY_FIRST_CONSONANT: Set<string> = new Set(["ㄸ", "ㅃ", "ㅉ"]);

// 종성으로만 올 수 있는 자음
export const ONLY_LAST_CONSONANT: Set<string> = new Set([
  " ",
  "ㄳ",
  "ㄵ",
  "ㄶ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅄ",
]);

/**
 * 한글 문자열을 자음과 모음으로 분리합니다.
 *
 * @param input 한글 문자열 (예: "안녕하세요")
 * @returns 분리된 자음과 모음을 담은 {@link HangulSeparationResult} 객체
 */
export function separateHangulToJamo(input: string): HangulSeparationResult {
  const consonants: string[] = [];
  const vowels: string[] = [];

  for (const char of input) {
    // 유니코드 0xAC00 ~ 0xD7A3 범위는 한글 음절
    if (char >= "\uac00" && char <= "\ud7a3") {
      const uniVal = char.charCodeAt(0) - 0xac00;

      // 초성 분리
      const choIdx = Math.floor(uniVal / (21 * 28));
      consonants.push(FIRST_CONSONANT.charAt(choIdx));

      // 중성 분리
      const jungIdx = Math.floor((uniVal / 28) % 21);
      vowels.push(MIDDLE_VOWEL.charAt(jungIdx));

      // 종성 분리
      const jongIdx = uniVal % 28;
      consonants.push(LAST_CONSONANT.charAt(jongIdx));
    }
  }

  return new HangulSeparationResult(consonants, vowels);
}

/**
 * 한글 문자열을 자음과 모음으로 분리하여 하나의 리스트에 모두 담습니다.
 *
 * @param input 한글 문자열 (예: "안녕하세요")
 * @returns 모든 자모(자음, 모음)를 포함하는 `string[]` (문자열 배열) 객체
 */
export function getAllJamoFromHangul(input: string): string[] {
  const components: string[] = [];

  for (const char of input) {
    // 유니코드 0xAC00 ~ 0xD7A3 범위는 한글 음절
    if (char >= "\uac00" && char <= "\ud7a3") {
      const uniVal = char.charCodeAt(0) - 0xac00;

      // 초성 분리
      const choIdx = Math.floor(uniVal / (21 * 28));
      components.push(FIRST_CONSONANT.charAt(choIdx));

      // 중성 분리
      const jungIdx = Math.floor((uniVal / 28) % 21);
      components.push(MIDDLE_VOWEL.charAt(jungIdx));

      // 종성 분리
      const jongIdx = uniVal % 28;
      if (jongIdx !== 0) {
        components.push(LAST_CONSONANT.charAt(jongIdx));
      }
    }
  }
  return components;
}

// ----------------------------------------
// 아래는 테스트를 위한 임시 코드입니다.
// ----------------------------------------
const testInput = "안녕하세요";
const result = separateHangulToJamo(testInput);
console.log(`입력: "${testInput}"`);
console.log(`자음: ${result.consonants.join(", ")}`);
console.log(`모음: ${result.vowels.join(", ")}`);

const allJamo = getAllJamoFromHangul(testInput);
console.log(`모든 자모: ${allJamo.join(", ")}`);
