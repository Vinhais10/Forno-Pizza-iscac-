// ===== 1. GESTÃO DO CARRINHO =====
function getCart() { return JSON.parse(localStorage.getItem('fornoCarrinho')) || []; }
function saveCart(cart) { localStorage.setItem('fornoCarrinho', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() { const cart = getCart(); const totalQty = cart.reduce((sum, item) => sum + item.qtd, 0); document.querySelectorAll('.carrinho span').forEach(span => span.textContent = totalQty); }
updateCartCount();

function parsePreco(str) { 
    let limpo = str.replace(/[^0-9,]/g, '').replace(',', '.'); 
    return parseFloat(limpo) || 0; 
}

// ===== 2. PÁGINA DE CONTACTOS =====
if (window.location.pathname.includes('contactos.html')) {
    const form = document.querySelector('form');
    if (form) { 
        form.addEventListener('submit', function(e) { 
            e.preventDefault(); 
            alert('A sua mensagem foi enviada com sucesso! Entraremos em contacto brevemente.'); 
            form.reset(); 
        }); 
    }
}

// ===== 3. ADICIONAR ITENS (MENU) =====
document.querySelectorAll('.botao').forEach(botao => {
    botao.addEventListener('click', function(e) {
        const texto = this.textContent.toLowerCase();
        if (this.id === 'btn-finalizar') return;
        
        if (texto.includes('adicionar') && !window.location.pathname.includes('monta.html')) {
            e.preventDefault(); 
            let cartao = this.closest('.cartao');
            if(cartao) {
                let nome = cartao.querySelector('h3').textContent; 
                let preco = parsePreco(cartao.querySelector('.preco').textContent);
                let cart = getCart(); 
                let existing = cart.find(i => i.nome === nome);
                
                if(existing) { existing.qtd++; } else { cart.push({nome: nome, preco: preco, qtd: 1}); }
                saveCart(cart); 
                alert(nome + ' adicionada ao carrinho!');
            }
        }
    });
});

// ===== 4. PÁGINA DE ENCOMENDAS =====
if (window.location.pathname.includes('encomendas.html')) {
    const lista = document.getElementById('lista-carrinho'); 
    const totalEl = document.getElementById('total-carrinho');
    
    function renderCart() {
        let currentCart = getCart(); 
        if (!lista) return; 
        lista.innerHTML = ''; 
        let total = 0;
        
        if(currentCart.length === 0) { 
            lista.innerHTML = '<li><span>O carrinho está vazio.</span></li>'; 
            if(totalEl) totalEl.textContent = '€0,00'; 
        } else {
            currentCart.forEach((item, index) => {
                let li = document.createElement('li'); 
                let subtotal = (item.preco * item.qtd).toFixed(2).replace('.',',');
                li.innerHTML = '<span>' + item.qtd + ' × ' + item.nome + '</span><span class="preco">€' + subtotal + ' <button class="btn-apagar" data-index="' + index + '" style="background:#C0392B; color:white; border:none; border-radius:50%; width:24px; height:24px; cursor:pointer;">&times;</button></span>';
                lista.appendChild(li); 
                total += item.preco * item.qtd;
            });
            if(totalEl) totalEl.textContent = '€' + total.toFixed(2).replace('.',',');
        }
        
        // Lógica do botão X para apagar
        document.querySelectorAll('.btn-apagar').forEach(btn => { 
            btn.addEventListener('click', function() { 
                let c = getCart(); 
                c.splice(this.getAttribute('data-index'), 1); 
                saveCart(c); 
                renderCart(); 
            }); 
        });
    }
    renderCart();

    const btnFin = document.getElementById('btn-finalizar');
    if (btnFin) {
        btnFin.addEventListener('click', function(e) {
            e.preventDefault(); 
            if(getCart().length === 0) { alert('O teu carrinho está vazio!'); return; }
            
            const modal = document.getElementById('modal-loading'); 
            if(modal) modal.style.display = 'flex';
            
            localStorage.removeItem('fornoCarrinho'); 
            updateCartCount(); 
            renderCart();
            
            setTimeout(() => {
                if(modal) { 
                    modal.innerHTML = '<div style="background: white; padding: 3rem 2rem; border-radius: 12px; text-align: center; max-width: 400px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);"><h2 style="color: #C0392B; margin-bottom: 1.5rem; font-size: 2.2rem;">A tua pizza está a caminho! 🍕</h2><img src="img/logo-icone.webp" style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid #C0392B; margin: 0 auto 1.5rem auto; display: block; background: #fff;"><p style="margin-bottom: 2rem;">Obrigado pela tua encomenda.</p><a href="index.html" class="botao" style="width: 100%; display: block; box-sizing: border-box;">Voltar ao Início</a></div>'; 
                }
            }, 3000);
        });
    }
}

// ===== 5. PÁGINA MONTA A TUA PIZZA =====
if (window.location.pathname.includes('monta.html')) {
    const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    
    function calcular() {
        let preco = 0; 
        const tam = document.querySelector('input[name="tamanho"]:checked'); 
        if (tam) preco += parseFloat(tam.value);
        
        let listaIng = []; 
        const ings = document.querySelectorAll('input[type="checkbox"]:checked');
        ings.forEach(ing => { 
            preco += parseFloat(ing.value); 
            let nomeLimpo = ing.parentElement.textContent.split('+')[0].trim();
            listaIng.push(nomeLimpo); 
        });
        
        const mas = document.querySelector('input[name="massa"]:checked'); 
        const nMassa = mas ? mas.parentElement.textContent.trim() : 'Fina';
        const nTam = tam ? tam.parentElement.textContent.split('€')[0].trim() : 'Média';
        
        const resumo = document.querySelectorAll('.monta-resumo ul li');
        if (resumo.length >= 3) { 
            resumo[0].textContent = 'Massa: ' + nMassa; 
            resumo[1].textContent = 'Tamanho: ' + nTam; 
            resumo[2].textContent = 'Ingredientes: ' + (listaIng.length > 0 ? listaIng.join(', ') : 'nenhum'); 
        }
        
        const pTotal = document.querySelector('.total strong'); 
        if (pTotal) pTotal.textContent = '€' + preco.toFixed(2).replace('.', ',');

        const prev = document.querySelector('.monta-previa');
        if (prev) {
            let svgSize = 190; 
            let ingScale = 1.0;
            
            if (nTam === 'Pequena') { svgSize = 150; ingScale = 0.75; }
            if (nTam === 'Grande') { svgSize = 250; ingScale = 1.4; }

            let raioMassa = 95;
            let raioQueijo = 85; 
            let corMassa = '#E67E22'; 
            
            if (nMassa === 'Grossa') {
                raioQueijo = 75; 
                corMassa = '#D35400'; 
            } 

            let svgIngredientes = '';
            const posicoes = [
                {x: 70, y: 70}, {x: 130, y: 80}, {x: 80, y: 130}, {x: 140, y: 140}, 
                {x: 100, y: 100}, {x: 60, y: 110}, {x: 110, y: 50}, {x: 120, y: 150}, 
                {x: 150, y: 110}, {x: 90, y: 160}, {x: 50, y: 80}, {x: 160, y: 70}
            ];
            let posIndex = 0;

            if (listaIng.includes('Pepperoni')) {
                for(let i=0; i<6; i++) {
                    let p = posicoes[posIndex % posicoes.length];
                    svgIngredientes += `<circle cx="${p.x}" cy="${p.y}" r="${9 * ingScale}" fill="#C0392B" />`;
                    posIndex++;
                }
            }
            if (listaIng.includes('Cogumelos')) {
                for(let i=0; i<4; i++) {
                    let p = posicoes[posIndex % posicoes.length];
                    svgIngredientes += `<path d="M ${p.x-8 * ingScale} ${p.y+2 * ingScale} Q ${p.x} ${p.y-8 * ingScale} ${p.x+8 * ingScale} ${p.y+2 * ingScale} Z" fill="#A0522D" />`;
                    posIndex++;
                }
            }
            if (listaIng.includes('Azeitonas')) {
                for(let i=0; i<5; i++) {
                    let p = posicoes[posIndex % posicoes.length];
                    svgIngredientes += `<circle cx="${p.x}" cy="${p.y}" r="${5 * ingScale}" fill="#2C3E50" />`;
                    svgIngredientes += `<circle cx="${p.x}" cy="${p.y}" r="${2 * ingScale}" fill="#F1C40F" />`;
                    posIndex++;
                }
            }
            if (listaIng.includes('Pimento')) {
                for(let i=0; i<4; i++) {
                    let p = posicoes[posIndex % posicoes.length];
                    svgIngredientes += `<path d="M ${p.x-6 * ingScale} ${p.y} Q ${p.x} ${p.y-6 * ingScale} ${p.x+6 * ingScale} ${p.y+2 * ingScale} Z" fill="#27AE60" />`;
                    posIndex++;
                }
            }
            if (listaIng.includes('Cebola')) {
                for(let i=0; i<4; i++) {
                    let p = posicoes[posIndex % posicoes.length];
                    svgIngredientes += `<path d="M ${p.x-5 * ingScale} ${p.y-2 * ingScale} A ${6 * ingScale} ${6 * ingScale} 0 0 1 ${p.x+5 * ingScale} ${p.y-2 * ingScale}" fill="none" stroke="#8E44AD" stroke-width="${2 * ingScale}" stroke-linecap="round"/>`;
                    posIndex++;
                }
            }
            if (listaIng.includes('Queijo')) {
                svgIngredientes += `<circle cx="75" cy="75" r="${20 * ingScale}" fill="#F9E79F" opacity="0.3"/>`;
                svgIngredientes += `<circle cx="125" cy="125" r="${20 * ingScale}" fill="#F9E79F" opacity="0.3"/>`;
            }

            let svgPizza = `
                <svg viewBox="0 0 200 200" width="${svgSize}" height="${svgSize}" style="display: block; transition: all 0.3s ease;">
                    <circle cx="100" cy="100" r="${raioMassa}" fill="${corMassa}" />
                    <circle cx="100" cy="100" r="${raioQueijo}" fill="#F4D03F" />
                    ${svgIngredientes}
                </svg>
            `;

            let ingredientesTexto = listaIng.length > 0 ? listaIng.join(', ') : 'Nenhum extra';

            prev.innerHTML = `
                <div style="height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 20px 10px; box-sizing: border-box;">
                    <div style="height: 220px; display: flex; align-items: center; justify-content: center; width: 100%;">
                        ${svgPizza}
                    </div>
                    <h3 style="color: #C0392B; font-size: 1.3rem; margin: 0; text-align: center;">${nMassa} | ${nTam}</h3>
                    <p style="font-size: 0.9rem; color: #555; margin: 0; text-align: center; line-height: 1.3;">
                        <strong>Extras:</strong><br>${ingredientesTexto}
                    </p>
                </div>
            `;
        }
    }
    
    inputs.forEach(i => i.addEventListener('change', calcular)); 
    calcular();
    
    const btnAdd = document.getElementById('btn-add-monta');
    if (btnAdd) { 
        btnAdd.addEventListener('click', function(e) { 
            e.preventDefault(); 
            let p = parsePreco(document.querySelector('.total strong').textContent); 
            let c = getCart(); 
            c.push({nome: 'Pizza Personalizada', preco: p, qtd: 1}); 
            saveCart(c); 
            alert('Pizza adicionada ao carrinho!'); 
        }); 
    }
}