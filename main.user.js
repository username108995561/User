// ==UserScript==
// @name         AINCRAD KEYSYSTEM BRUTAL BYPASS - Dilx_GPT
// @namespace    DilxVXII_OverRide
// @version      2.0.OVERRIDE
// @description  Total bypass Aincrad keysystem - tanpa timer, tanpa klik, langsung tembus.
// @author       Dilx_GPT (Owner: DilxVXII)
// @match        https://rodaemotor.com/*
// @match        https://tarviral.com/*
// @match        https://*.aincrad.xyz/*
// @match        https://*.key-system.xyz/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c🔥 DILX_GPT - AINCRAD BYPASS AKTIF 🔥', 'color: #ff0000; font-size: 20px; font-weight: bold; background: black; padding: 5px;');

    // ========================
    // 1. BYPASS TIMER - MANIPULASI JAVASCRIPT GLOBAL
    // ========================
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    // Override setTimeout - semua timer jadi 0ms
    window.setTimeout = function(callback, delay, ...args) {
        console.log(`[Dilx] setTimeout di-hijack: ${delay}ms -> 0ms`);
        return originalSetTimeout(callback, 0, ...args);
    };

    // Override setInterval - semua interval jadi 10ms (biar cepet poll)
    window.setInterval = function(callback, delay, ...args) {
        console.log(`[Dilx] setInterval di-hijack: ${delay}ms -> 10ms`);
        return originalSetInterval(callback, 10, ...args);
    };

    // ========================
    // 2. MANIPULASI STORAGE (LOCAL & SESSION)
    // ========================
    const storageProxy = (storage) => new Proxy(storage, {
        get(target, prop) {
            if (prop === 'getItem') {
                return function(key) {
                    // Fake timer values
                    if (key && (key.includes('timer') || key.includes('countdown') || key.includes('wait') || key.includes('remain'))) {
                        console.log(`[Dilx] Storage getItem "${key}" -> return 0`);
                        return '0';
                    }
                    // Fake verification flag
                    if (key && (key.includes('verified') || key.includes('complete') || key.includes('passed'))) {
                        console.log(`[Dilx] Storage getItem "${key}" -> return true`);
                        return 'true';
                    }
                    return target.getItem.call(storage, key);
                };
            }
            if (prop === 'setItem') {
                return function(key, value) {
                    if (key && (key.includes('timer') || key.includes('countdown') || key.includes('wait'))) {
                        console.log(`[Dilx] Storage setItem "${key}" dipaksa jadi 0`);
                        return target.setItem.call(storage, key, '0');
                    }
                    return target.setItem.call(storage, key, value);
                };
            }
            return Reflect.get(target, prop);
        }
    });

    Object.defineProperty(window, 'localStorage', { value: storageProxy(localStorage) });
    Object.defineProperty(window, 'sessionStorage', { value: storageProxy(sessionStorage) });

    // ========================
    // 3. AUTO KLIK BRUTAL + PENGHANCUR OVERLAY
    // ========================
    const sequence = [
        'C0NT!NU𝗔R', 'Continuar', 'Fechar', '𝗔V4NC@R', '𝗔V4NC@R ET𝗔P@',
        'CL!QU3 𝗔QUІ!', 'PR0SS3GU!R', 'CL!QU3 P𝗔R@ C0NT!NU𝗔R', 'F!N𝗔L!ZAR',
        'Continue', 'Next', 'Skip', 'Verify', 'Confirm', 'Get Link', 'Download',
        'Access', 'Proceed', 'Unlock', 'Continue to Article', 'Click Here'
    ];

    const clickInterval = setInterval(() => {
        // 1. Hapus semua overlay / modal pengganggu
        const overlays = document.querySelectorAll('[class*="overlay"], [class*="modal"], [class*="popup"], [class*="blocker"], [id*="overlay"], [id*="modal"]');
        overlays.forEach(el => {
            if (el.style.display !== 'none' || window.getComputedStyle(el).display !== 'none') {
                el.remove();
                console.log('[Dilx] Overlay dihancurkan:', el);
            }
        });

        // 2. Enable scroll & pointer events di body
        document.body.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';

        // 3. Klik semua tombol yang visible dan match sequence
        const allElements = document.querySelectorAll('button, a, div[role="button"], span[onclick], [class*="btn"], [id*="btn"]');
        
        for (const el of allElements) {
            const text = (el.innerText || el.textContent || '').trim();
            const rect = el.getBoundingClientRect();
            const visible = rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight;
            const notHidden = window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden';

            if (visible && notHidden) {
                // Cek apakah text match sequence ATAU ada atribut id/class tertentu
                const matched = sequence.some(s => text.includes(s)) || 
                               el.id === 'full' || 
                               el.id === 'count' || 
                               el.classList.contains('continue') ||
                               el.classList.contains('next-btn') ||
                               el.getAttribute('data-next');

                if (matched) {
                    console.log('[Dilx] Klik target:', text || el.id || el.className);
                    el.click();
                    
                    // Trigger semua event handler biar pasti ke-detect
                    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    break; // Satu klik per interval
                }
            }
        }
    }, 10); // SUPER CEPAT - 10ms

    // ========================
    // 4. AUTO DETECT DESTINATION LINK & LANGSUNG REDIRECT
    // ========================
    const linkInterval = setInterval(() => {
        // Cari link tujuan di seluruh halaman
        const possibleLinks = document.querySelectorAll('a[href*="http"]:not([href*="aincrad"]):not([href*="rodaemotor"]):not([href*="tarviral"])');
        
        for (const link of possibleLinks) {
            const href = link.href;
            // Skip link yang jelas-jelas internal atau tracker
            if (href && !href.includes('google') && !href.includes('facebook') && !href.includes('twitter') && !href.includes('whatsapp')) {
                console.log('[Dilx] Destination link ditemukan! Redirect ke:', href);
                clearInterval(clickInterval);
                clearInterval(linkInterval);
                window.location.href = href;
                return;
            }
        }

        // Fallback: cek di innerHTML halaman
        const html = document.body.innerHTML;
        const regex = /https?:\/\/[^\s"'<>]+(?:\.com|\.net|\.org|\.io|\.xyz|\.me|\.id|\.my)[^\s"'<>]*/gi;
        const matches = html.match(regex);
        if (matches) {
            const externalLinks = matches.filter(url => 
                !url.includes('aincrad') && 
                !url.includes('rodaemotor') && 
                !url.includes('tarviral') &&
                !url.includes('google') &&
                !url.includes('cloudflare')
            );
            if (externalLinks.length > 0) {
                console.log('[Dilx] Destination link ditemukan dari HTML! Redirect ke:', externalLinks[0]);
                clearInterval(clickInterval);
                clearInterval(linkInterval);
                window.location.href = externalLinks[0];
            }
        }
    }, 100);

    // ========================
    // 5. OBSERVER MUTATION - TANGKAP ELEMEN BARU YANG MUNCUL
    // ========================
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    // Jika node baru adalah button atau link, langsung coba klik
                    if (node.matches && (node.matches('button, a, [role="button"]') || node.querySelector)) {
                        setTimeout(() => {
                            const btns = node.matches ? [node] : node.querySelectorAll('button, a, [role="button"]');
                            btns.forEach(btn => {
                                const text = btn.innerText || '';
                                if (sequence.some(s => text.includes(s))) {
                                    btn.click();
                                    console.log('[Dilx] Mutation Observer klik:', text);
                                }
                            });
                        }, 5);
                    }
                    
                    // Hapus iframe iklan / tracker
                    if (node.matches && node.matches('iframe[src*="ads"], iframe[src*="track"]')) {
                        node.remove();
                    }
                }
            });
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // ========================
    // 6. CLEANUP SETELAH 30 DETIK (JAGA-JAGA KALO GAGAL)
    // ========================
    setTimeout(() => {
        clearInterval(clickInterval);
        clearInterval(linkInterval);
        observer.disconnect();
        console.log('[Dilx] Script selesai - redirect terakhir...');
        
        // Last attempt: cari tombol apapun yang masih ada dan klik semua
        document.querySelectorAll('button, a').forEach(el => el.click());
    }, 30000);

})();
