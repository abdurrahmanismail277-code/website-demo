const aboutPage=document.querySelector('.about-page');
if(aboutPage){
 const calendlyUrl='https://calendly.com/abdurrahmanismail277/30min';
 document.querySelectorAll('.calendly-booking').forEach(button=>button.addEventListener('click',event=>{
  event.preventDefault();
  if(window.Calendly&&typeof window.Calendly.initPopupWidget==='function')window.Calendly.initPopupWidget({url:calendlyUrl});
  else window.open(calendlyUrl,'_blank','noopener,noreferrer');
 }));
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reducedMotion)aboutPage.classList.add('motion-enabled');
 const readingParagraph=document.querySelector('.about-reading');
 if(!reducedMotion&&readingParagraph){
  const readingWords=[];
  const wordNodes=document.createDocumentFragment();
  (readingParagraph.textContent.match(/\s+|\S+/g)||[]).forEach(part=>{
   if(/^\s+$/.test(part))wordNodes.append(document.createTextNode(part));
   else{const word=document.createElement('span');word.className='reading-word';word.textContent=part;readingWords.push(word);wordNodes.append(word)}
  });
  readingParagraph.replaceChildren(wordNodes);
  readingParagraph.classList.add('reading-ready');
  let readingFrame=0;
  function updateReadingProgress(){
   readingFrame=0;
   const guide=innerHeight*.54;
   let currentWord=null;
   readingWords.forEach(word=>{
    const bounds=word.getBoundingClientRect();
    const center=bounds.top+bounds.height/2;
    if(center<=guide)word.classList.add('is-read');
    else if(!currentWord&&bounds.top<innerHeight&&bounds.bottom>0)currentWord=word;
   });
   readingWords.forEach(word=>word.classList.toggle('is-current',word===currentWord));
  }
  function queueReadingProgress(){if(!readingFrame)readingFrame=requestAnimationFrame(updateReadingProgress)}
  addEventListener('scroll',queueReadingProgress,{passive:true});
  addEventListener('resize',queueReadingProgress,{passive:true});
  updateReadingProgress();
 }
 const animated=[...document.querySelectorAll('.word-reveal,.about-subhead,.about-closing')];
 if(!reducedMotion&&'IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
  }),{threshold:.16});
  animated.forEach(element=>observer.observe(element));
 }else animated.forEach(element=>element.classList.add('is-visible'));
 const progress=document.getElementById('about-progress');
 function updateProgress(){
  const scrollable=document.documentElement.scrollHeight-innerHeight;
  if(progress)progress.style.width=(scrollable>0?Math.min(100,scrollY/scrollable*100):0)+'%';
 }
 addEventListener('scroll',updateProgress,{passive:true});
 addEventListener('resize',updateProgress,{passive:true});
 updateProgress();
}
