const themeButton=document.getElementById('theme');
const yearLabel=document.getElementById('yr');
if(yearLabel)yearLabel.textContent=new Date().getFullYear();
let savedTheme='dark';
try{savedTheme=localStorage.getItem('itqan-theme')||'dark'}catch{}
if(savedTheme==='light')document.documentElement.dataset.theme='light';
if(themeButton){
 themeButton.textContent=savedTheme==='light'?'☼':'◐';
 themeButton.addEventListener('click',()=>{
  const light=document.documentElement.dataset.theme!=='light';
  if(light)document.documentElement.dataset.theme='light';else delete document.documentElement.dataset.theme;
  try{localStorage.setItem('itqan-theme',light?'light':'dark')}catch{}
  themeButton.textContent=light?'☼':'◐';
 });
}

const overlay=document.getElementById('ov');
const menuButton=document.getElementById('burger');
const closeButton=document.getElementById('close');
if(overlay&&menuButton&&closeButton){
 const links=[...overlay.querySelectorAll('.ov-link')];
 let oldBodyOverflow='',oldRootOverflow='';
 const onAbout=document.body.dataset.page==='about';
 function syncMenuCurrent(){
  if(onAbout){
   links.forEach(link=>{const active=/about\.html(?:$|#)/.test(link.getAttribute('href')||'');link.classList.toggle('on',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});
   return;
  }
  const sections=['home','projects','contact'].map(id=>document.getElementById(id)).filter(Boolean);
  if(!sections.length)return;
  let current=sections[0];
  const marker=scrollY+innerHeight*.35;
  sections.forEach(section=>{if(section.offsetTop<=marker)current=section});
  links.forEach(link=>{const active=link.hash==='#'+current.id;link.classList.toggle('on',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});
 }
 function openMenu(){
  oldBodyOverflow=document.body.style.overflow;
  oldRootOverflow=document.documentElement.style.overflow;
  document.body.style.overflow='hidden';document.documentElement.style.overflow='hidden';
  overlay.setAttribute('aria-hidden','false');overlay.classList.add('open');menuButton.setAttribute('aria-expanded','true');
  syncMenuCurrent();closeButton.focus({preventScroll:true});
 }
 function closeMenu(){
  if(!overlay.classList.contains('open'))return;
  overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');menuButton.setAttribute('aria-expanded','false');
  document.body.style.overflow=oldBodyOverflow;document.documentElement.style.overflow=oldRootOverflow;
  menuButton.focus({preventScroll:true});
 }
 menuButton.addEventListener('click',openMenu);closeButton.addEventListener('click',closeMenu);
 links.forEach(link=>link.addEventListener('click',closeMenu));
 if(!onAbout)addEventListener('scroll',syncMenuCurrent,{passive:true});
 addEventListener('keydown',event=>{
  if(!overlay.classList.contains('open'))return;
  if(event.key==='Escape'){event.preventDefault();closeMenu();return}
  if(event.key!=='Tab')return;
  const focusable=[...overlay.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.getClientRects().length);
  const first=focusable[0],last=focusable[focusable.length-1];
  if(!overlay.contains(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus()}
  else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 });
}

document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const link=event.target.closest('a[href]');
 if(!link||link.target||link.hasAttribute('download'))return;
 const destination=new URL(link.href,location.href);
 if(destination.origin!==location.origin||destination.pathname===location.pathname)return;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 event.preventDefault();
 document.documentElement.classList.add('page-leaving');
 setTimeout(()=>location.assign(destination.href),300);
});
