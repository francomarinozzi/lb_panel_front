import"./styles-BRwFBWJn.js";const L="http://localhost:3000",e=t=>document.getElementById(t),B=e("loginSection"),I=e("loginForm"),u=e("loginBtn"),f=e("loginError"),k=e("adminPanel"),d=e("adminList"),$=e("adminCount"),C=e("adminSearchInput"),b=e("statusMsg"),x=e("productModal"),T=e("productForm"),E=e("modalTitle"),p=e("modalError"),y=e("productId"),m=e("saveBtn");let r=[],S=null;const j=new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}),s=t=>String(t??"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n]);function c(t,n=!0){b.textContent=t,b.className=`mt-4 text-sm text-center ${n?"text-verde":"text-coral"}`,clearTimeout(c.timer),c.timer=setTimeout(()=>b.classList.add("hidden"),3500)}function h(t,n){t.textContent=n,t.classList.remove("hidden")}function N(){B.classList.add("hidden"),k.classList.remove("hidden"),k.classList.add("flex"),v()}localStorage.getItem("lb_auth")==="true"&&N();I.addEventListener("submit",async t=>{t.preventDefault(),f.classList.add("hidden"),u.disabled=!0,u.textContent="Verificando…";try{const n=await fetch(`${L}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e("username").value,password:e("password").value})}),o=await n.json().catch(()=>({}));if(!n.ok){h(f,o.error||"Credenciales incorrectas.");return}localStorage.setItem("lb_auth","true"),N()}catch(n){console.error(n),h(f,"No pudimos conectar con el servidor.")}finally{u.disabled=!1,u.textContent="Ingresar"}});e("logoutBtn").addEventListener("click",()=>{localStorage.removeItem("lb_auth"),location.reload()});function F(){d.innerHTML=Array.from({length:6},()=>`
        <li class="py-4 animate-pulse flex items-center gap-4">
          <div class="h-3.5 bg-rule/50 rounded w-1/3"></div>
          <div class="h-3.5 bg-rule/30 rounded flex-1"></div>
          <div class="h-8 bg-rule/40 rounded w-20"></div>
        </li>
      `).join("")}function P(){const t=C.value.trim().toLowerCase(),n=t?r.filter(o=>String(o.nombre).toLowerCase().includes(t)):r;if($.textContent=r.length?`${n.length} de ${r.length} ${r.length===1?"producto":"productos"}`:"",!n.length){d.innerHTML=`<li class="py-10 text-center text-ink-3">${r.length?"No encontramos productos con ese nombre.":"Todavía no hay productos cargados."}</li>`;return}d.innerHTML=n.map(o=>`
        <li class="py-3 flex items-center gap-3">
          <span class="min-w-0 grow">
            <span class="block text-ink truncate">${s(o.nombre)}</span>
            <span class="eyebrow mt-1 block">${s(o.unidad)}</span>
          </span>
          <span class="display tnum text-brand shrink-0">${s(j.format(o.precio))}</span>
          <span class="flex gap-1 shrink-0">
            <button type="button" data-action="edit" data-id="${s(o.id)}"
              class="p-2 rounded text-ink-2 hover:text-brand hover:bg-crema-deep transition-colors"
              aria-label="Editar ${s(o.nombre)}">
              <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.2 5.2l3.6 3.6M16.7 3.7a2.5 2.5 0 113.6 3.6L6.5 21H3v-3.5L16.7 3.7z"/>
              </svg>
            </button>
            <button type="button" data-action="delete" data-id="${s(o.id)}"
              class="p-2 rounded text-ink-2 hover:text-coral hover:bg-crema-deep transition-colors"
              aria-label="Eliminar ${s(o.nombre)}">
              <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.9 12.1a2 2 0 01-2 1.9H7.9a2 2 0 01-2-1.9L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </span>
        </li>
      `).join("")}async function v(){F();try{const t=await fetch(`${L}/products`);if(!t.ok)throw new Error(`HTTP ${t.status}`);r=(await t.json()).sort((o,a)=>o.nombre.localeCompare(a.nombre,"es")),P()}catch(t){console.error(t),$.textContent="",d.innerHTML=`
          <li class="py-10 text-center">
            <p class="text-ink">No pudimos cargar los productos.</p>
            <button type="button" data-action="retry" class="btn btn-outline mt-4">Reintentar</button>
          </li>`}}async function w(t,n,o){const a=await fetch(`${L}${n}`,{method:t,headers:o?{"Content-Type":"application/json"}:void 0,body:o?JSON.stringify(o):void 0});if(!a.ok){const i=await a.json().catch(()=>({}));throw new Error(i.error||`HTTP ${a.status}`)}return a.status===204?null:a.json().catch(()=>null)}function M(t){S=document.activeElement,p.classList.add("hidden"),T.reset(),t?(E.textContent="Editar producto",y.value=t.id,e("prodName").value=t.nombre,e("prodUnit").value=t.unidad,e("prodPrice").value=t.precio):(E.textContent="Nuevo producto",y.value=""),x.classList.remove("hidden"),document.body.style.overflow="hidden",e("prodName").focus()}function g(){x.classList.add("hidden"),document.body.style.overflow="",S?.focus()}e("newBtn").addEventListener("click",()=>M(null));e("cancelBtn").addEventListener("click",g);e("modalBackdrop").addEventListener("click",g);document.addEventListener("keydown",t=>{t.key==="Escape"&&!x.classList.contains("hidden")&&g()});T.addEventListener("submit",async t=>{t.preventDefault(),p.classList.add("hidden");const n={nombre:e("prodName").value.trim(),unidad:e("prodUnit").value.trim(),precio:Number(e("prodPrice").value)};if(!n.nombre||!n.unidad||!Number.isFinite(n.precio)){h(p,"Completá todos los campos.");return}const o=y.value;m.disabled=!0,m.textContent="Guardando…";try{o?await w("PUT",`/products/${o}`,n):await w("POST","/products",n),g(),c(o?"Producto actualizado.":"Producto creado."),await v()}catch(a){console.error(a),h(p,`No se pudo guardar: ${a.message}`)}finally{m.disabled=!1,m.textContent="Guardar"}});d.addEventListener("click",async t=>{const n=t.target.closest("button[data-action]");if(!n)return;const{action:o,id:a}=n.dataset;if(o==="retry")return v();const i=r.find(l=>String(l.id)===String(a));if(i){if(o==="edit")return M(i);if(o==="delete"){if(!confirm(`¿Eliminar "${i.nombre}"? Esta acción no se puede deshacer.`))return;try{await w("DELETE",`/products/${a}`),c("Producto eliminado."),await v()}catch(l){console.error(l),c(`No se pudo eliminar: ${l.message}`,!1)}}}});C.addEventListener("input",P);
