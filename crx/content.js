import{r as o,j as t,I as C,e as A}from"./assets/__uno-snsfYxhK.js";function P(s,l){l.push(s),requestAnimationFrame(()=>{if(l.length!==0){const r=l.pop();r&&r(),l.length=0}})}const W=({toggleRecordBox:s})=>{const[l,r]=o.useState({centerX:0,centerY:0}),[a,i]=o.useState({width:0,height:0});o.useEffect(()=>{e();function e(){const c=document.documentElement;r({centerX:c.clientWidth/2,centerY:c.clientHeight/2}),i({width:c.clientWidth,height:c.clientHeight}),u(!0)}return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}},[]);let m=!1,p={startX:0,startY:0};const n=o.useRef(null),f=o.useRef(null),v=[],x={left:o.useRef(null),right:o.useRef(null),top:o.useRef(null),bottom:o.useRef(null)},[y,R]=o.useState("top");function j(e){m=!0,p={startX:e.clientX,startY:e.clientY},document.addEventListener("mousemove",_),document.addEventListener("mouseup",D),f.current.style.opacity="1",Object.values(x).forEach(c=>{c.current.style.opacity="1"})}function _(e){if(e.preventDefault(),!m)return;P(()=>{const{clientX:g,clientY:E}=e,B=g-p.startX,L=E-p.startY,{left:$,top:k}=n.current.getBoundingClientRect();n.current.style.left=`${$+B}px`,n.current.style.top=`${k+L}px`,p={startX:g,startY:E},u(!1)},v)}function D(){m=!1,document.removeEventListener("mousemove",_),document.removeEventListener("mouseup",D),f.current.style.opacity="0",setTimeout(()=>{Object.values(x).forEach(e=>{e.current.style.opacity="0"})},300),u(!0)}function u(e=!1){const{left:c,top:g,width:E,height:B}=n.current.getBoundingClientRect(),L=c+E/2,$=g+B/2,{centerX:k,centerY:N}=l,U=N/k,I=X=>U*X,F=-N/k,S=X=>F*X;let d="top";const b=L-k,w=$-N;w<I(b)&&w<S(b)&&(d="top"),w>I(b)&&w>S(b)&&(d="bottom"),w>I(b)&&w<S(b)&&(d="left"),w<I(b)&&w>S(b)&&(d="right"),(d==="top"||d==="bottom")&&(x[d].current.style.left=`${L-16}px`),(d==="left"||d==="right")&&(x[d].current.style.top=`${$-16}px`),e&&(R(d),n.current.style.transition="all 0.3s",requestAnimationFrame(()=>{d==="right"&&(n.current.style.left=`${document.documentElement.clientWidth-E}px`),d==="left"&&(n.current.style.left="0px"),d==="top"&&(n.current.style.top="0px"),d==="bottom"&&(n.current.style.top=`${document.documentElement.clientHeight-B}px`)}),setTimeout(()=>{n.current.style.transition=""},150))}function h(){s()}return t.jsxs(t.Fragment,{children:[t.jsxs("div",{ref:n,className:"rounded-full p-[16px] fixed z-[2147483647] cursor-pointer",children:[Object.keys(x).map((e,c)=>t.jsx("div",{className:`
                drag-${c}
                h-[16px] w-[16px] absolute
                rounded-[4px] bg-blue-500 cursor-pointer
                ${e==="left"?"left-0 top-[50%] translate-y-[-50%]":""}
                ${e==="right"?"right-0 top-[50%] translate-y-[-50%]":""}
                ${e==="top"?"top-0 left-[50%] translate-x-[-50%]":""}
                ${e==="bottom"?"bottom-0 left-[50%] translate-x-[-50%]":""}
              `,style:{display:y===e?"block":"none"},onMouseDown:g=>j(g)},`drag-${c}`)),t.jsx("div",{className:`
            w-[52px] h-[52px]
            flex items-center justify-center
            box-border
            border-2 border-solid border-amber-500
            bg-amber-100 rounded-full p-[8px]
          `,title:"点击前往录制页面",children:t.jsx(C,{icon:"icon-park:movie",width:"32",height:"32",onClick:h})})]}),t.jsx("div",{ref:f,className:`
          opacity-0 transition-[300] z-[2147483646]
          box-border border-[8px] border-solid border-[#f60]
          fixed left-0 top-0
          pointer-events-none
        `,style:{width:a.width,height:a.height}}),Object.keys(x).map((e,c)=>t.jsx("div",{ref:x[e],className:`
              movebar-shadow-${c}
              rounded-[4px] bg-blue-500
              fixed opacity-0 z-[2147483647]
              pointer-events-none
              ${e==="left"||e==="top"?"left-0 top-0":"right-0 bottom-0"}
              ${e==="left"||e==="right"?"h-[32px] w-[8px]":"w-[32px] h-[8px]"}
            `},`shadow-${c}`))]})},G="_smooth_slideInDown_18unr_13",K="_slideInDown_18unr_1",V="_smooth_slideInLeft_18unr_28",J="_slideLft_18unr_1",Q="_smooth_slideInRight_18unr_43",Z="_slideRight_18unr_1",z={smooth_slideInDown:G,slideInDown:K,smooth_slideInLeft:V,slideLft:J,smooth_slideInRight:Q,slideRight:Z},T=s=>{const[l,r]=o.useState(!1),a=o.useRef({x:0,y:0}),i=n=>{r(!0),a.current={x:n.clientX,y:n.clientY}},m=n=>{if(n.preventDefault(),!l)return;const{clientX:f,clientY:v}=n,x=f-a.current.x,y=v-a.current.y;if(!s.current)return;const{left:R,top:j}=s.current.getBoundingClientRect();s.current.style.left=`${R+x}px`,s.current.style.top=`${j+y}px`,a.current={x:f,y:v}},p=n=>{n.preventDefault(),r(!1)};return o.useEffect(()=>(document.addEventListener("mousemove",m),document.addEventListener("mouseup",p),()=>{document.removeEventListener("mousemove",m),document.removeEventListener("mouseup",p)}),[l]),{dragging:l,handleMouseDown:i}},q=({cameraMicrophoneStream:s,startRecord:l,start:r})=>{const a=o.useRef(null),i=o.useRef(null),{handleMouseDown:m}=T(a);return o.useEffect(()=>{s&&(i.current.srcObject=s)},[s]),t.jsxs("div",{ref:a,className:`
        ${z.smooth_slideInRight}
        fixed bottom-[10px] left-[10px] h-[240px] w-[240px] z-[2147483647]
      `,onMouseDown:m,children:[t.jsx("div",{className:"w-full h-full rounded-full bg-red-300 overflow-hidden cursor-pointer",children:t.jsx("video",{autoPlay:!0,playsInline:!0,muted:!0,ref:i,className:"object-cover w-full h-full transform !scale-x-[-1]"})}),t.jsx("div",{className:`
          p-[4px]
          rounded-full border-[2px] border-[#8c8c8d]
          flex items-center bg-[#212121] cursor-pointer
          absolute bottom-4 right-0 transform translate-x-[100%]
        `,onClick:()=>r&&l(!1),children:t.jsx(C,{icon:r?"fluent:record-stop-16-regular":"gg:play-stop-o",className:`
            ${r?"text-red-400":"text-blue-400"}
            h-[40px] w-[40px] text-[#9797a4] rounded-full pointer-events-none
          `})})]})},ee="_hoverButton_66c1k_1",te="_startButton_66c1k_14",Y={hoverButton:ee,startButton:te},ne=({toggleStreamState:s,startRecord:l,start:r})=>{const a=o.useRef(null),[i,m]=o.useState({video:!0,audio:!0}),{handleMouseDown:p}=T(a);function n(f){m({...i,[f]:!i[f]}),s(f,!i[f])}return t.jsx(t.Fragment,{children:!r&&t.jsxs("div",{ref:a,className:`
              ${z.smooth_slideInLeft}
              fixed top-[20px] right-[20px] z-[2147483647]
              bg-[#212121] p-[16px] font-size-[16px]
              h-[420px] w-[280px] rounded-[16px]
            `,onMouseDown:p,children:[t.jsxs("div",{className:Y.hoverButton,children:[t.jsx(C,{icon:i.video?"gg:camera":"majesticons:camera-off-line",width:"24",height:"24",className:`
                  hover:text-orange-400 hover:scale-125 transition-300
                  ${i.video?"text-white":"text-red-500"}
                `,onClick:()=>n("video")}),t.jsx("div",{className:"text-white mx-8 max-w-[100px] truncate",children:"Camera"})]}),t.jsxs("div",{className:Y.hoverButton,children:[t.jsx(C,{icon:i.audio?"ph:microphone-bold":"iconamoon:microphone-off",width:"24",height:"24",className:`
                  text-2xl hover:text-orange-400 hover:scale-125 transition-300
                  ${i.audio?"text-white":"text-red-500"}
                `,onClick:()=>n("audio")}),t.jsx("div",{className:"text-white mx-8 max-w-[100px] truncate",children:"Microphone"})]}),t.jsx("div",{className:Y.startButton,onClick:()=>l(!0),children:"Start Recording"})]})})};const M=1e3,oe=()=>{const[s,l]=o.useState(!1),[r,a]=o.useState(null),[i,m]=o.useState(null),p=o.useRef([]),n=o.useRef(),[f,v]=o.useState(!1),x=o.useRef({video:1e3*M,audio:128*M});chrome.runtime.onMessage.addListener(function(u,h,e){console.log(u,h),x.current=u,e("ok")});async function y(){l(!s),R(!s)}async function R(u){if(!u)return r==null||r.getTracks().forEach(e=>e.stop()),a(null),!1;const h=await navigator.mediaDevices.getUserMedia({video:{width:300,height:300},audio:!0});return a(h),!0}function j(u,h){u==="audio"&&(r==null||r.getAudioTracks().forEach(e=>{e.enabled=h})),u==="video"&&(r==null||r.getVideoTracks().forEach(e=>{e.enabled=h}))}async function _(u){var h;if(v(u),u){let e;try{e=await navigator.mediaDevices.getDisplayMedia()}catch{v(!1);return}m(e),n.current=new MediaRecorder(e,{mimeType:"video/webm; codecs=vp9",videoBitsPerSecond:x.current.video,audioBitsPerSecond:x.current.audio});const c=n.current;c.start(1e3),c.ondataavailable=g=>{p.current.push(g.data)},c.onstop=()=>{v(!1),c.stream.getTracks().forEach(g=>g.stop()),D(),i==null||i.getTracks().forEach(g=>g.stop()),m(null)};return}(h=n.current)==null||h.stop()}function D(){const u=new Blob(p.current,{type:"video/webm"}),h=URL.createObjectURL(u),e=document.createElement("a");e.href=h,e.download="your-record.webm",e.click(),e.remove(),URL.revokeObjectURL(h),p.current=[]}return t.jsxs(t.Fragment,{children:[t.jsx(W,{toggleRecordBox:y}),s&&t.jsxs("div",{children:[t.jsx(q,{cameraMicrophoneStream:r,startRecord:_,start:f}),t.jsx(ne,{toggleStreamState:j,startRecord:_,start:f})]})]})},H=document.createElement("div"),O="--crx--content--";H.id=O;document.body.appendChild(H);const se=A.createRoot(document.getElementById(O));se.render(t.jsx(oe,{}));try{const s=document.createElement("script");s.setAttribute("type","text/javascript"),s.src=chrome.runtime.getURL("insert.js"),document.body.appendChild(s)}catch(s){console.log(s)}
