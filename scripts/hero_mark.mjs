const CRYSTAL = '/assets/logo-crystal.png';
const HEADER = '/assets/logo-header.png';
const FOOTER = '/assets/logo-footer.png';
const AICRON = '1BHox7UUEVMJHfAPN4qPh5r4o';
const NAVLOGO = 'tJ1jqpEOBL9Nna5facx9Yh1rSA';

export function lockHeroMark(html) {
  const marker = 'data-framer-name="Event Name"';
  let at = 0;
  let found = -1;
  while ((at = html.indexOf(marker, at)) !== -1) {
    const before = html.slice(Math.max(0, at - 240), at);
    if (before.includes('<figure')) {
      found = at;
      break;
    }
    at += marker.length;
  }
  if (found === -1) return html;
  html = html.slice(0, found) + 'data-framer-name="Event Name" style="opacity:1"' + html.slice(found + marker.length).replace(
    /^\s*style="[^"]*"/,
    ''
  );
  const imgStart = html.indexOf('<img', found);
  const imgEnd = html.indexOf('>', imgStart);
  if (imgStart === -1 || imgEnd === -1 || imgStart - found > 900) return html;
  let img = html.slice(imgStart, imgEnd + 1);
  img = img
    .replace(/\s(?:srcset|sizes)="[^"]*"/g, '')
    .replace(/\ssrc="[^"]*"/, ` src="${CRYSTAL}"`)
    .replace(/\salt(?:="[^"]*")?(?=[\s>])/g, '');
  img = img.replace('<img', '<img alt="MUUN"');
  return html.slice(0, imgStart) + img + html.slice(imgEnd + 1);
}

export const heroMarkCss = `
      figure.framer-f0om72 { opacity: 1 !important; }
      figure.framer-f0om72 img { object-fit: contain !important; }
      /* Navbar ships with opacity:0.001 + translateY(-40px) until Framer's
         appear animation runs. On slow networks that can take seconds, leaving
         the header empty, so render it in its final state immediately. */
      nav.framer-Luar2[data-framer-appear-id] {
        opacity: 1 !important;
        transform: none !important;
      }
      img[src*="${AICRON}"],
      img[srcset*="${AICRON}"],
      img[src*="${NAVLOGO}"],
      img[srcset*="${NAVLOGO}"] {
        visibility: hidden !important;
      }
`;

export const heroMarkScript = `
    <script>
      (function () {
        var CRYSTAL = ${JSON.stringify(CRYSTAL)};
        var HEADER = ${JSON.stringify(HEADER)};
        var FOOTER = ${JSON.stringify(FOOTER)};
        var AICRON = ${JSON.stringify(AICRON)};
        var NAVLOGO = ${JSON.stringify(NAVLOGO)};
        function fixImg(img) {
          if (!img || img.tagName !== 'IMG') return;
          var src = img.getAttribute('src') || '';
          var set = img.getAttribute('srcset') || '';
          var hero = img.closest && img.closest('figure.framer-f0om72');
          if (hero) {
            hero.style.setProperty('opacity', '1', 'important');
            if (src.indexOf('logo-crystal.png') === -1 || set) {
              img.removeAttribute('srcset');
              img.removeAttribute('sizes');
              if ((img.getAttribute('src') || '').indexOf('logo-crystal.png') === -1) img.setAttribute('src', CRYSTAL);
            }
            return;
          }
          var next = '';
          if (src.indexOf(NAVLOGO) !== -1 || set.indexOf(NAVLOGO) !== -1) next = HEADER;
          else if (src.indexOf(AICRON) !== -1 || set.indexOf(AICRON) !== -1) next = FOOTER;
          if (!next) return;
          img.removeAttribute('srcset');
          img.removeAttribute('sizes');
          if ((img.getAttribute('src') || '').indexOf(next) === -1) img.setAttribute('src', next);
        }
        function scan(root) {
          if (!root || !root.querySelectorAll) return;
          var imgs = root.querySelectorAll('img');
          for (var i = 0; i < imgs.length; i++) fixImg(imgs[i]);
        }
        new MutationObserver(function (list) {
          for (var i = 0; i < list.length; i++) {
            var rec = list[i];
            if (rec.type === 'attributes') fixImg(rec.target);
            var nodes = rec.addedNodes;
            if (!nodes) continue;
            for (var j = 0; j < nodes.length; j++) {
              var n = nodes[j];
              if (n.tagName === 'IMG') fixImg(n);
              else scan(n);
            }
          }
        }).observe(document.documentElement, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['src', 'srcset']
        });
        scan(document);
      })();
    </script>
`;
