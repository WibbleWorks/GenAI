// loader.js — JSON-first lesson loading (P5).
//
// lessons/manifest.json + lessons/<level>/<id>.json are the source of truth.
// Inline COURSE_DATA (course-data.js / practical-examples.js) is the fallback.
// JSON wins per-lesson when its id matches an inline lesson.
//
// Boot: index.html loads this before main.js. It starts fetching immediately
// and exposes window.courseDataReady (a promise). main.js awaits it in init()
// before first render, with a timeout race so offline still boots inline.
//
// Pilot (P5): ai_introduction ships WITHOUT inline content; the loader fills
// it. If the loader ever regresses, that lesson renders empty — the browser
// smoke test asserts its content is non-empty, so CI catches it.
//
// Node harness: scripts/test-loader.mjs imports the pure fns below.

(function () {
    'use strict';

    var MANIFEST_URL = 'lessons/manifest.json';
    var TIMEOUT_MS = 5000;

    // Merge JSON lessons over inline courseData. Returns {applied, missing}.
    // JSON wins field-by-field for lessons whose id matches; unknown ids are
    // ignored (quantum-course lessons must never leak into core).
    function overlayJsonLessons(courseData, jsonLessons) {
        var applied = [], missing = [];
        var byId = {};
        Object.values(courseData.levels || {}).forEach(function (level) {
            Object.entries(level.lessons || {}).forEach(function (entry) {
                byId[entry[0]] = entry[1];
            });
        });
        (jsonLessons || []).forEach(function (jl) {
            if (!jl || !jl.id) return;
            var inline = byId[jl.id];
            if (!inline) { missing.push(jl.id); return; }
            Object.keys(jl).forEach(function (k) {
                if (jl[k] !== undefined) inline[k] = jl[k];
            });
            applied.push(jl.id);
        });
        return { applied: applied, missing: missing };
    }

    function fetchJson(url) {
        return fetch(url).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
            return r.json();
        });
    }

    function loadAll(fetchFn) {
        fetchFn = fetchFn || fetchJson;
        return fetchFn(MANIFEST_URL).then(function (manifest) {
            var entries = (manifest && manifest.lessons) || [];
            return Promise.all(entries.map(function (e) {
                return fetchFn(e.path).catch(function () { return null; });
            }));
        }).then(function (lessons) {
            return lessons.filter(function (l) { return !!l; });
        });
    }

    // Browser glue: start immediately so main.js can await us.
    if (typeof window !== 'undefined') {
        var ready = null;
        try {
            var timeout = new Promise(function (_, reject) {
                setTimeout(function () { reject(new Error('loader timeout')); }, TIMEOUT_MS);
            });
            ready = Promise.race([loadAll(), timeout]).catch(function () { return null; });
        } catch (e) {
            ready = Promise.resolve(null);
        }
        window.courseDataReady = ready;
        window.applyJsonLessons = overlayJsonLessons;
    }

    // Node export for scripts/test-loader.mjs
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { overlayJsonLessons: overlayJsonLessons, loadAll: loadAll, MANIFEST_URL: MANIFEST_URL };
    }
})();
