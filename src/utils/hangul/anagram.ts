import {
  HangulSeparationResult,
  separateHangulToJamo,
  FIRST_CONSONANT,
  MIDDLE_VOWEL,
  LAST_CONSONANT,
  ONLY_FIRST_CONSONANT,
  ONLY_LAST_CONSONANT,
} from "./separation";

/**
 * 배열의 요소를 무작위로 섞습니다 (Fisher-Yates 셔플 알고리즘).
 *
 * @param array 섞을 배열
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * 입력된 한글 단어에서 가능한 랜덤 애너그램 조합을 생성합니다.
 *
 * @param word 애너그램을 생성할 한글 단어
 * @returns 생성된 랜덤 애너그램
 */
export function anagramGenerate(word: string): string {
  // 1. 단어를 자모로 분리합니다.
  const jamoList: HangulSeparationResult = separateHangulToJamo(word);

  // 2. 자음과 모음을 랜덤으로 섞습니다.
  shuffleArray(jamoList.consonants as string[]);
  shuffleArray(jamoList.vowels as string[]);

  // 3-1. 초성, 종성을 구분하여 따로 보관합니다.
  const choSongList: string[] = [];
  const jongSungList: string[] = [];
  const tempConsonants: string[] = []; // 남는 자음

  for (const consonant of jamoList.consonants) {
    if (ONLY_FIRST_CONSONANT.has(consonant)) {
      choSongList.push(consonant);
    } else if (ONLY_LAST_CONSONANT.has(consonant)) {
      jongSungList.push(consonant);
    } else {
      tempConsonants.push(consonant);
    }
  }

  // 3-2. 초성, 종성 리스트를 마저 채워줍니다.
  const wordLength = jamoList.vowels.length;
  const index = wordLength - choSongList.length;

  if (choSongList.length < wordLength) {
    choSongList.push(...tempConsonants.slice(0, index));
  }
  if (jongSungList.length < wordLength) {
    jongSungList.push(...tempConsonants.slice(index));
  }

  // 3-3. 초성, 종성을 랜덤으로 섞습니다.
  shuffleArray(choSongList);
  shuffleArray(jongSungList);

  // 4. 초성, 중성, 종성을 합쳐서 애너그램을 만듭니다.
  const resultChars: string[] = [];
  for (let i = 0; i < wordLength; i++) {
    const choIdx = FIRST_CONSONANT.indexOf(choSongList[i]);
    const jungIdx = MIDDLE_VOWEL.indexOf(jamoList.vowels[i]);
    let jongIdx = 0;
    if (jongSungList[i] !== " ") {
      // " "는 종성이 없음을 의미
      jongIdx = LAST_CONSONANT.indexOf(jongSungList[i]);
    }

    const uniVal = choIdx * (21 * 28) + jungIdx * 28 + jongIdx;
    resultChars.push(String.fromCharCode(uniVal + 0xac00));
  }

  // 5. 애너그램을 반환합니다.
  return resultChars.join("");
}

// ----------------------------------------
// 아래는 테스트를 위한 임시 코드입니다.
// ----------------------------------------
const testInput = "안녕하세요";
console.log(`입력: "${testInput}"`);

const anagramResult = anagramGenerate(testInput);
console.log(`생성된 애너그램: "${anagramResult}"`);

const anagramResult2 = anagramGenerate("타입스크립트");
console.log(`생성된 애너그램: "${anagramResult2}"`);
