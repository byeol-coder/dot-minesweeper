/*
 * tts.js — Standalone TW_TTS 호환 음성 모듈 (독립 배포용)
 * ---------------------------------------------------------------------------
 * 이 파일은 "숨은 점 찾기"를 닷게임즈 호스트 없이 (GitHub Pages 등에서)
 * 단독 실행할 때 음성을 제공하기 위한 것입니다. 게임 코드는 window.TW_TTS 만
 * 참조하므로, 여기서 동일한 인터페이스를 Web Speech API 로 구현합니다.
 *
 * 규격 준수 원칙:
 *  1) 이미 호스트가 window.TW_TTS 를 주입했다면 절대 덮어쓰지 않습니다(호스트 우선).
 *  2) 닷게임즈 플랫폼 임베드(embed=1) 컨텍스트에서는 브라우저 speechSynthesis 를
 *     쓰지 않아야 하므로, 임베드로 판단되면 이 shim 은 조용한 no-op 으로 동작하고
 *     호스트의 TW_TTS 에게 음성을 완전히 위임합니다.
 *  3) 단독(top-level, embed 아님) 실행일 때만 speechSynthesis 기반 음성을 켭니다.
 *
 * 지원 인터페이스: setLang(lang), setEnabled(bool), speak(text,{lang,onEnd}), stop()
 */
(function () {
  "use strict";

  // (1) 호스트가 이미 제공했으면 손대지 않는다.
  if (window.TW_TTS) return;

  // (2) 임베드 컨텍스트 판정: embed=1 이거나 상위 프레임에 실려 있으면 임베드로 간주.
  var params = new URLSearchParams(window.location.search);
  var embedded = params.get("embed") === "1" || window.parent !== window;

  var synth = window.speechSynthesis || null;
  var state = { enabled: true, lang: "ko", voices: [] };

  function refreshVoices() {
    try { state.voices = synth ? synth.getVoices() : []; } catch (_) { state.voices = []; }
  }
  if (synth) {
    refreshVoices();
    // 크롬은 voice 목록을 비동기로 채웁니다.
    if (typeof synth.onvoiceschanged !== "undefined") {
      synth.onvoiceschanged = refreshVoices;
    }
  }

  function pickVoice(lang) {
    var prefix = lang === "en" ? "en" : "ko";
    if (!state.voices.length) refreshVoices();
    // 1순위: 언어 프리픽스 정확 일치, 2순위: 이름에 Korean/English 포함
    var exact = state.voices.filter(function (v) { return (v.lang || "").toLowerCase().indexOf(prefix) === 0; });
    if (exact.length) {
      // 로컬(오프라인) 보이스를 우선
      var local = exact.filter(function (v) { return v.localService; });
      return (local[0] || exact[0]);
    }
    return null;
  }

  var lastUtterance = null;

  var impl = {
    setLang: function (lang) { state.lang = lang === "en" ? "en" : "ko"; },
    setEnabled: function (on) {
      state.enabled = !!on;
      if (!state.enabled) this.stop();
    },
    speak: function (text, options) {
      options = options || {};
      if (!state.enabled || !synth || !text) {
        if (options.onEnd) { try { options.onEnd(); } catch (_) {} }
        return;
      }
      var lang = options.lang === "en" || options.lang === "ko" ? options.lang : state.lang;
      // 중복 음성 방지: 새 발화 전에 진행 중인 음성을 정리합니다.
      try { synth.cancel(); } catch (_) {}
      var utter = new SpeechSynthesisUtterance(String(text));
      utter.lang = lang === "en" ? "en-US" : "ko-KR";
      var voice = pickVoice(lang);
      if (voice) utter.voice = voice;
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.volume = 1.0;
      if (options.onEnd) {
        utter.onend = function () { try { options.onEnd(); } catch (_) {} };
        utter.onerror = function () { try { options.onEnd(); } catch (_) {} };
      }
      lastUtterance = utter;
      try { synth.speak(utter); } catch (_) {}
    },
    stop: function () {
      if (!synth) return;
      try { synth.cancel(); } catch (_) {}
      lastUtterance = null;
    }
  };

  // 임베드 컨텍스트에서는 speechSynthesis 를 절대 쓰지 않는다(플랫폼 규격).
  // 호스트 TW_TTS 가 나중에 주입될 수 있으므로 조용한 no-op 을 임시로 둡니다.
  var noop = {
    setLang: function () {},
    setEnabled: function () {},
    speak: function (_t, o) { if (o && o.onEnd) { try { o.onEnd(); } catch (_) {} } },
    stop: function () {}
  };

  window.TW_TTS = embedded ? noop : impl;

  // 접근성 안내: 일부 브라우저는 사용자 상호작용 이후에만 음성을 허용합니다.
  // 게임의 첫 버튼 클릭/키 입력에서 speak() 가 호출되므로 별도 처리 불필요.
})();
