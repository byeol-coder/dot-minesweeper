# 닷 지뢰찾기 (Dot Minesweeper)

DotPad 60×40 촉각 핀 디스플레이용 지뢰찾기. 시각장애 사용자를 위한 음성·촉각 우선 설계로, Dot Games 플랫폼 규약을 따릅니다.

## 특징
- **촉각 렌더링** — 6×5 격자(칸당 10×8핀)를 60×40 핀 면에 꽉 채움. 미공개=사각 테두리, 숫자=점 개수, 깃발=가운데 점, 지뢰=칸 채움, 커서=칸 안쪽 사각. 남은 지뢰 수는 점자 숫자.
- **음성 안내(슈퍼닷 TW_TTS)** — 이동·열기·깃발·현황을 한국어로 안내. 서버 음성(`/api/tts`)이 없으면 브라우저 음성으로 자동 폴백.
- **DotPad SDK 3.0.0** — BLE 연결, `displayGraphicData`/`displayTextData` 출력, Panning·F1~F4 물리 키 지원.
- **접근성** — 로빙 탭인덱스 그리드, `aria-live` 안내, 포커스 표시, 색 대비(AA), 축소 화면·확대·`prefers-reduced-motion` 대응.

## 조작
- **화면/키보드**: 방향키 이동 · Enter 열기 · F 깃발 · C 현재 칸 · R 현황 · B 판 읽기 · H 도움말 · N 새 게임 (마우스: 클릭 열기, 우클릭 깃발)
- **DotPad**: Panning 이동 · F1 열기 · F2 깃발 · F3 현재 칸 · F4 판 읽기 · PanningAll 도움말 · LPF1 새 게임
- **난이도**: 쉬움(지뢰 4) · 보통(지뢰 6) · 어려움(지뢰 8)

## 구조
```
index.html                     단일 파일 게임
tts.js                         슈퍼닷 TW_TTS 모듈(브라우저 음성 폴백 포함)
dotpad-sdk/DotPadSDK-3.0.0.js  DotPad SDK (ES 모듈)
```

## 배포 (GitHub Pages)
1. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `/ (root)`.
2. 게시 후 `https://byeol-coder.github.io/dot-minesweeper/` 에서 실행.

`tts.js`는 상대경로(`./tts.js`)로 참조하므로 프로젝트 Pages 경로에서도 정상 로드됩니다. Pages는 정적 호스팅이라 서버 음성(`/api/tts`)은 동작하지 않고, 최상위 창에서 브라우저 음성으로 자동 폴백합니다. `dot-games-host`에 임베드해 배포하면 호스트의 서버 음성이 그대로 사용됩니다.

## 임베드
`?embed=1` 로 상단 설명을 숨기고, 부모 창에 `postMessage({source:'dotarcade', type:'ready'|'gameover', ...})` 를 전달합니다.
