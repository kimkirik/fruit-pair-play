# 과일 짝꿍 맞추기

모바일과 PC에서 즐기는 3D 과일 카드 짝 맞추기 게임입니다.

- 10스테이지: 8장부터 44장까지, 항상 가로 4장
- 모든 과일은 짝수 개, 이미지 중심 정렬
- 3초 힌트와 레트로 카드 효과음·클리어 멜로디
- 모바일 세로/가로 및 PC에 맞는 반응형 구성

## 실행

Node.js 22.13 이상이 필요합니다.

```sh
npm ci
npm run dev
```

## 정적 배포 (Vercel)

```sh
npm run build:static
```

`out/`이 배포 결과입니다. `vercel.json`에 빌드 설정이 포함되어 있습니다.

## 게임 규칙 검증

```sh
node --experimental-strip-types --test tests/game.test.ts
```

3D 과일 그림은 이 게임을 위해 AI로 생성한 이미지입니다. 레트로 멜로디는 Web Audio로 합성합니다.
