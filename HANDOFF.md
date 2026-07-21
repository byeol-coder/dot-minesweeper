# 닷 지뢰찾기 (Dot Minesweeper) — 개발자 핸드오프

DotPad 60×40 촉각 지뢰찾기. 음성·촉각 우선, Dot Games 임베드 규격 준수.

## 링크
- 저장소: https://github.com/byeol-coder/dot-minesweeper
- 실행(단독): https://byeol-coder.github.io/dot-minesweeper/
- 임베드용: https://byeol-coder.github.io/dot-minesweeper/?embed=1
- 임베드+핀 미리보기: https://byeol-coder.github.io/dot-minesweeper/?embed=1&preview=1

## 임베드
<iframe src="https://byeol-coder.github.io/dot-minesweeper/?embed=1" allow="bluetooth" style="width:100%;height:100%;border:0;" title="닷 지뢰찾기"></iframe>

- `?embed=1` 상단 설명 숨김 · `allow="bluetooth"` DotPad 연결에 필요 · `?preview=1` 핀 출력 미리보기(개발용)

## postMessage (source:'dotarcade')
- ready: `{source:'dotarcade', type:'ready'}` — 로드 완료 시
- gameover: `{source:'dotarcade', type:'gameover', win:boolean, time:number}` — 승/패 시(time=경과 초)

## 음성(TTS)
- dot-games-host 배포: 호스트 서버 음성(/api/tts) 사용(권장).
- GitHub Pages 단독 iframe: 브라우저 음성 폴백. iframe은 첫 사용자 조작(키/클릭) 이후 재생됨(직후 무음은 정상).

## 조작
- 화면/키보드: 방향키 이동 · Enter 열기 · F 깃발 · C 현재칸 · R 현황 · B 판읽기 · H 도움말 · N 새게임 (우클릭 깃발)
- DotPad: Panning 이동 · F1 열기 · F2 깃발 · F3 현재칸 · F4 판읽기 · PanningAll 도움말 · LPF1 새게임
- 난이도: 쉬움4 · 보통6(기본) · 어려움8

## DotPad 촉각 규격
- 60×40, SDK dotpad-sdk/DotPadSDK-3.0.0.js(ES 모듈). displayGraphicData(hex)+displayTextData(점자).
- 격자 6×5(30칸), 칸 10×8핀. 인코딩 dotBit=lx*4+ly, 600 hex.
- 글리프: 미공개=테두리 · 숫자=점개수 · 깃발=가운데점 · 지뢰=칸채움 · 커서=안쪽사각.
- Web Bluetooth → 크롬/엣지만, 사파리 미지원.

## 접근성/반응형
- 음성·촉각 우선, aria-live, 로빙 탭인덱스, WCAG AA, 배경 On/Off 토글.
- ≤480px 셀 정사각·터치44px·컨트롤 2열, ≤360px 추가 축소.

## 배포(GitHub Pages)
- Settings→Pages→Deploy from a branch, main /(root). .nojekyll 포함.
- 재배포 지연 시 빈 커밋 트리거: git commit --allow-empty -m "redeploy" && git push

문의: 별(이샛별) · @byeol-coder
