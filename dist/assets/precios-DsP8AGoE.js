import"./styles-C_cZFtkm.js";const m="http://localhost:3000",n=document.getElementById("priceList"),s=document.getElementById("resultCount"),a=document.getElementById("searchInput");document.getElementById("year").textContent=String(new Date().getFullYear());let r=[];const p=new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}),o=t=>String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),l=(t,e="text-ink-3")=>`<li class="py-10 text-center ${e}">${o(t)}</li>`;function g(){n.innerHTML=Array.from({length:8},()=>`
        <li class="py-4 animate-pulse">
          <div class="flex items-baseline gap-4">
            <div class="h-3.5 bg-rule/50 rounded w-2/5"></div>
            <div class="h-3.5 bg-rule/30 rounded flex-1"></div>
            <div class="h-3.5 bg-rule/50 rounded w-16"></div>
          </div>
        </li>
      `).join("")}function y(t){if(s.textContent=r.length?`${t.length} ${t.length===1?"producto":"productos"}`:"",!t.length){n.innerHTML=l("No encontramos productos con ese nombre.");return}n.innerHTML=t.map(e=>`
        <li class="leader py-4">
          <span class="min-w-0">
            <span class="block text-ink">${o(e.nombre)}</span>
            <span class="eyebrow mt-1 block">${o(e.unidad)}</span>
          </span>
          <span class="leader-fill"></span>
          <span class="display tnum text-lg text-brand shrink-0">${o(p.format(e.precio))}</span>
        </li>
      `).join("")}function b(){s.textContent="",n.innerHTML=`
        <li class="py-10 text-center">
          <p class="text-ink">No pudimos cargar la lista de precios.</p>
          <p class="prose-warm mt-1 text-sm">Revisá tu conexión e intentá de nuevo.</p>
          <button type="button" id="retryBtn" class="btn btn-outline mt-5">Reintentar</button>
        </li>`,document.getElementById("retryBtn").addEventListener("click",c)}function i(){const t=a.value.trim().toLowerCase();y(t?r.filter(e=>String(e.nombre).toLowerCase().includes(t)):r)}async function c(){g();try{const t=await fetch(`${m}/products`);if(!t.ok)throw new Error(`HTTP ${t.status}`);if(r=(await t.json()).sort((d,u)=>d.nombre.localeCompare(u.nombre,"es")),!r.length){s.textContent="",n.innerHTML=l("Todavía no hay productos cargados.");return}i()}catch(t){console.error("Error cargando precios:",t),b()}}a.addEventListener("input",i);c();
