(function(){
  // Safe element lookups
  var entrance  = document.getElementById('library-entrance');
  var stagHot   = document.getElementById('stag-hotspot');
  var stagBubble= document.getElementById('stag-bubble');
  var crestHot  = document.getElementById('crest-hotspot');
  var cover     = document.getElementById('waterfall-cover');
  var scene     = document.getElementById('waterfall-scene');
  var brambleTxt = document.getElementById('bramble-bubble');
  var kingTxt = document.getElementById('king-bubble');

  // If stag elements exist, wire stag behavior
  if (entrance && stagHot && stagBubble){
    var GRACE_MS = 9000;
    var hideTimer = null;


    function showStagBubble(){
      stagBubble.hidden = false;
      stagBubble.classList.add('show-bubble');
      stagHot.setAttribute('aria-expanded','true');
    }
    function hideStagBubble(){
      stagBubble.classList.remove('show-bubble');
      stagBubble.hidden = true;
      stagHot.setAttribute('aria-expanded','false');
      entrance.classList.remove('show-threshold');
    }
    function restartReveal(){
      entrance.classList.remove('reveal');
      void entrance.offsetWidth;
      entrance.classList.add('reveal');
    }
    function triggerReveal(){
      clearTimeout(hideTimer);
      entrance.classList.add('show-threshold');
      showStagBubble();
      if (cover) cover.hidden = false;
      if (scene) scene.hidden = false;
      restartReveal();
      hideTimer = setTimeout(function(){
        entrance.classList.remove('reveal');
        if (cover) cover.hidden = true;
        if (scene) scene.hidden = true;
        hideStagBubble();
      }, GRACE_MS);
    }
// --- DEBUG SWITCH ---
const DEBUG = true;

// Log unhandled errors & resource 404s
window.addEventListener('error', (e) => {
  console.error('[ERROR]', e.message || e, e.filename || '', e.lineno || '');
}, true);
window.addEventListener('unhandledrejection', (e) => {
  console.error('[PROMISE]', e.reason);
});

// Network/resource load issues (images, css, js)
document.addEventListener('error', (e) => {
  const t = e.target || {};
  console.warn('[RESOURCE ERROR]', t.tagName, t.src || t.href || t.id || t.className);
}, true);

// Helper
function dbg(...args){ if (DEBUG) console.log('[DBG]', ...args); }



    stagHot.addEventListener('mouseenter', function(){
      entrance.classList.add('show-threshold');
      showStagBubble();
    });
    stagHot.addEventListener('mouseleave', function(){
      if (!entrance.classList.contains('reveal')) hideStagBubble();
    });
    stagHot.addEventListener('click', function(e){ e.preventDefault(); triggerReveal(); });
    stagHot.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerReveal(); }
    });

    document.addEventListener('click', function(e){
      if (e.target === stagHot || (stagBubble && stagBubble.contains(e.target))) return;
      entrance.classList.remove('reveal');
      if (cover) cover.hidden = true;
      if (scene) scene.hidden = true;
      hideStagBubble();
    });

    if (!stagBubble.textContent || !stagBubble.textContent.trim()){
      stagBubble.textContent = "Once, a few bold children slipped at the lip of a fall... and the waters whisked them into Glimmerglass.";
    }
  } 

  // Armor / Cat call-and-response
  var armorHot = document.getElementById('armor-hotspot');
  var catHot   = document.getElementById('cat-hotspot');
  var backHot  = document.getElementById('catback-hotspot');
  var crestTxt = document.getElementById('crest-bubble');
  var armorTxt = document.getElementById('armor-bubble');
  var catTxt   = document.getElementById('cat-bubble');
  var consent  = document.getElementById('consent-bubble');

  // Only proceed if the primary elements exist
  if (armorHot && catHot && armorTxt && catTxt){
    // Timing knobs
    var SECOND_DELAY_MS = 5000; // delay before second speaker on armor click
    var AUTO_HIDE_MS    = 5000; // how long each bubble stays visible once shown
    var CREST_HIDE_MS  = 22000;     var CONSENT_HIDE_MS = 8000; // cat back consent bubble linger (ms)
// crest lines linger longer
    var CAT_REPLY_GAP   = 4000; // cat hotspot: gap before armor comeback
    var CAT_PUNCH_GAP   = 8000; // cat hotspot: gap before cat punchline
    var timers = [];
    var hideTimers = new Map(); // per-element hide timers
    var currentScript = null;
    var armorPlaying = false;
    var catPlaying = false;
    var armorCycle = 0;
    var crestPlaying = false;

    function clearTimers(){
      for (var i=0;i<timers.length;i++) clearTimeout(timers[i]);
      timers = [];
      if (hideTimers && hideTimers.size){ hideTimers.forEach(function(t){ clearTimeout(t); }); hideTimers.clear(); }
    }
    function hide(el){ if (!el) return; el.classList.remove('show-bubble'); el.hidden = true; }
    function hideAll(){ hide(armorTxt); hide(catTxt); hide(consent); hide(crestTxt); }

    function startSequence(name){ clearTimers(); hideAll(); currentScript = name; }

    function show(el, text, hideMs){
      if (!el) return;
      if (typeof text === 'string') el.textContent = text;
      el.hidden = false;
      requestAnimationFrame(function(){ el.classList.add('show-bubble'); });
      var ms = (typeof hideMs === 'number') ? hideMs : AUTO_HIDE_MS;
      if (hideTimers.has(el)) { try{ clearTimeout(hideTimers.get(el)); }catch(e){} hideTimers.delete(el); }
      var t = setTimeout(function(){ hide(el); hideTimers.delete(el); }, ms);
      hideTimers.set(el, t);
    }

   // --- Crest sequence (King explains the heraldry) ---
function crestSequence(){
  if (window.bramblePlaying || currentScript === 'bramble') return;
  if (crestPlaying) return;
  crestPlaying = true;
  startSequence('crest');

  // use the dedicated crest bubble
  show(crestTxt, "Ah... the Crest of Shirzan. Each part tells a story...", CREST_HIDE_MS);

  timers.push(setTimeout(function(){ if (currentScript !== 'crest') return;
    show(crestTxt, "The dolphin — a symbol from the Kennedy clan — symbolizes strength, nobility, joy and freedom on the water.", CREST_HIDE_MS);
  }, 10000));

  timers.push(setTimeout(function(){ if (currentScript !== 'crest') return;
    show(crestTxt, "The helmet — meaning armored Chief and is derived from the Gaelic \"Cinneidigh\" later to become Kennedy.", CREST_HIDE_MS);
  }, 22000));
  
  timers.push(setTimeout(function(){ if (currentScript !== 'crest') return;
    show(crestTxt, "The crown honors my 21st great-grandfather, Robert the Bruce — the first King of Scotland.", CREST_HIDE_MS);
  }, 34000));

  timers.push(setTimeout(function(){ if (currentScript !== 'crest') return;
    show(crestTxt, "The red lion honors my 10th cousin 9x removed, C. S. Lewis, and the Chronicles of Narnia that inspired this realm.", CREST_HIDE_MS);
  }, 48000));

  timers.push(setTimeout(function(){ if (currentScript !== 'crest') return;
    show(crestTxt, "And here... 'Avise la fin' — our motto — 'Consider the end.' A reminder to live with foresight and wisdom.", CREST_HIDE_MS);
  }, 62000));

  var totalDuration = 62000 + CREST_HIDE_MS + 120;
  timers.push(setTimeout(function(){
    hide(crestTxt);
    crestPlaying = false;
    if (currentScript === 'crest') currentScript = null;
  }, totalDuration));
}



function armorSequence(){
  if (window.bramblePlaying || currentScript === 'bramble') return;
  if (armorPlaying) return;
  armorPlaying = true;
  startSequence('armor');
  armorCycle += 1;

  // Clean slate so we don't inherit text from other sequences
  clearTimers();
  hideAll();
  if (armorTxt) armorTxt.textContent = "Pardon me, good feline — could I trouble you for a cup of Civet coffee?";
  if (catTxt)   catTxt.textContent   = "";

  // 0) Armor opening line
  show(armorTxt, "Pardon me, good feline — could I trouble you for a cup of Civet coffee?");

  // 1) Cat reply (t = 3s)
  timers.push(setTimeout(function(){ if (currentScript !== 'armor') return;
    show(catTxt, "I'm processing. It will be a while, I just ate.");
  }, 3000));

  // 2) Armor quip (t = 6s)
  timers.push(setTimeout(function(){ if (currentScript !== 'armor') return;
    show(armorTxt, "Ah, then perhaps a De-cat Red Squirrel Latte?");
  }, 6000));

  // 3) Cat mock outrage (t = 9s)
  timers.push(setTimeout(function(){ if (currentScript !== 'armor') return;
    show(catTxt, "So you want something from the De-cat Red Squirrel Latte line? We don't serve your kind here...");
  }, 9000));

  // 4) Armor apology (t = 12s)
  timers.push(setTimeout(function(){ if (currentScript !== 'armor') return;
    show(armorTxt, "I'm only joking.");
  }, 12000));

  // 5) Cat scripture (t = 15s)
  timers.push(setTimeout(function(){ if (currentScript !== 'armor') return;
    show(catTxt, "Proverbs 26:18-19");
  }, 15000));

  // 6) Armor plays dumb (t = 18s)
  timers.push(setTimeout(function(){ if (currentScript !== 'armor') return;
    show(armorTxt, "Is that from the book of Meow?");
  }, 18000));

  // 7) Cat punchline (t = 21s)
  timers.push(setTimeout(function(){ if (currentScript !== 'armor') return;
    show(catTxt, "Why don't you look it up? Brumble has your library card.");
  }, 21000));

  // Wrap after last line + fade
  var totalDuration = 21000 + AUTO_HIDE_MS + 100;
  timers.push(setTimeout(function(){
    armorPlaying = false;
    if (currentScript === 'armor') currentScript = null;
    hideAll();
  }, totalDuration));
}



    // Armor sequence: armor speaks, then cat replies
    

    // Cat sequence: cat jabs, armor replies, armor de-cat, cat punchline
    
function hideAll(){
  hide(armorTxt);
  hide(catTxt);
  hide(consent);
  hide(crestTxt);
  hide(brambleTxt);     // ← add this line
} 

function ejectForForbiddenScrolls(reason){
  // Mute everything else
  window.armorPlaying = false;
  window.catPlaying = false;
  window.crestPlaying = false;
  window.kingPlaying = false;

  // Optional: remember across reloads
  try {
    sessionStorage.setItem('kicked_by_scrolls', JSON.stringify({
      t: Date.now(),
      reason: reason || ""
    }));
  } catch(e){}

  clearTimers();
  hideAll();

  // Start Bramble as the only active script
  startSequence('bramble');
  window.bramblePlaying = true;

  // Bramble admonition
  show(brambleTxt, "You broke your oath, and integrity matters. Now take another card.", 12000);

  // Optional King follow-up after 13s
  timers.push(setTimeout(function(){
    if (typeof kingTxt !== 'undefined' && kingTxt){
      show(kingTxt, "Return with honor, and the door will open once more.", 12000);
    }
  }, 13000));

  // Finish after the King’s line has lingered
  var totalDuration = 13000 + 12000 + 100;
  timers.push(setTimeout(function(){
    hide(brambleTxt);
    if (typeof kingTxt !== 'undefined' && kingTxt) hide(kingTxt);
    window.bramblePlaying = false;
    if (currentScript === 'bramble') currentScript = null;
  }, totalDuration));
}

function catHeadSequence(){
  if (window.bramblePlaying || currentScript === 'bramble') return;
  if (catPlaying) return;
  catPlaying = true;
  startSequence('catHead');

  // Cat’s tease
  show(catTxt, "Hey Tin Man — weren't you going to be in the Mischief Players’ rendition of the Wizard of Odd?");

  // Armor’s comeback
  timers.push(setTimeout(function(){ 
    if (currentScript !== 'catHead') return;
    show(armorTxt, "I tried out... but my heart was not in it.");
  }, 5000));

  var totalDuration = 5000 + AUTO_HIDE_MS + 100;
  timers.push(setTimeout(function(){
    catPlaying = false;
    if (currentScript === 'catHead') currentScript = null;
    hideAll();
  }, totalDuration));
}

// ---------------- Hotspot wiring ----------------
if (armorHot){
  armorHot.addEventListener('mouseenter', function(){ armorSequence(); });
  armorHot.addEventListener('focus', function(){ armorSequence(); });
}
if (crestHot){
  crestHot.addEventListener('mouseenter', function(){ crestSequence(); });
  crestHot.addEventListener('focus', function(){ crestSequence(); });
}
if (catHot){
  catHot.addEventListener('mouseenter', function(){ catHeadSequence(); });
  catHot.addEventListener('focus', function(){ catHeadSequence(); });
}

// Back-of-cat consent message (optional)
if (backHot && consent){
  function showConsent(){
    clearTimers();
    hideAll();
    show(consent, undefined, CONSENT_HIDE_MS);
  }
  backHot.addEventListener('mouseenter', showConsent);
  backHot.addEventListener('focus', showConsent);
}
function enter(){
  saveOath();
  // If you have a specific Dark Arts landing page, put that path here:
    location.href = "../restricted/dark-arts.html";
}

} // ← CLOSES: if (armorHot && catHot && armorTxt && catTxt)  ✅

// close IIFE
})();
