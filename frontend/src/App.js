import { useState, useRef, useEffect } from "react";

const API = "http://localhost:5000/api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --black:#111111;
  --black2:#1A1A1A;
  --yellow:#F5C800;
  --yellow-dark:#D4AD00;
  --off:#F6F4EF;
  --white:#FFFFFF;
  --rule:#E2DDD5;
  --muted:#7A7060;
  --ink:#1E1C18;
  --serif:'Source Serif 4',Georgia,serif;
  --sans:'DM Sans',system-ui,sans-serif;
  --display:'Bebas Neue',Impact,sans-serif;
}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--off);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased}

.nav{background:var(--black);height:58px;display:flex;align-items:center;padding:0 1.5rem;gap:0.75rem;position:sticky;top:0;z-index:200;border-bottom:3px solid var(--yellow)}
.nav-brand{display:flex;align-items:center;gap:0.6rem;cursor:pointer}
.nav-dimark{width:34px;height:34px;border-radius:50%;background:var(--yellow);border:2px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:13px;color:var(--black);line-height:1;padding-top:1px;flex-shrink:0}
.nav-wordmark{font-family:var(--display);font-size:1.3rem;color:var(--white);letter-spacing:.06em;line-height:1}
.nav-wordmark em{color:var(--yellow);font-style:normal}
.nav-spacer{flex:1}
.nav-loc{font-size:.7rem;text-transform:uppercase;letter-spacing:.14em;color:rgba(255,255,255,.38);font-weight:500}
.nav-sbtn{background:var(--yellow);border:none;border-radius:3px;color:var(--black);font-family:var(--sans);font-size:.76rem;font-weight:700;padding:.4rem .9rem;cursor:pointer;text-transform:uppercase}

.hero{background:var(--black);padding:3.5rem 1.5rem 3rem;position:relative;overflow:hidden}
.hero-inner{max-width:660px;margin:0 auto;text-align:center;position:relative;z-index:2}
.hero-pill{display:inline-flex;align-items:center;gap:.45rem;background:rgba(245,200,0,.1);border:1px solid rgba(245,200,0,.25);border-radius:99px;padding:.25rem .9rem;font-size:.68rem;text-transform:uppercase;letter-spacing:.15em;color:var(--yellow);font-weight:700;margin-bottom:1.25rem}
.hero h1{font-family:var(--display);font-size:clamp(3rem,9vw,5.5rem);letter-spacing:.04em;line-height:.92;margin-bottom:1rem;color:var(--white)}
.hero h1 em{color:var(--yellow);font-style:normal;display:block}
.hero-sub{font-size:.92rem;color:rgba(255,255,255,.5);max-width:420px;margin:0 auto 2.25rem;font-weight:300;line-height:1.8}

.search-form{position:relative;max-width:520px;margin:0 auto}
.search-input{width:100%;padding:.875rem 5.5rem .875rem 1.1rem;border-radius:4px;border:2px solid transparent;font-family:var(--sans);font-size:.9rem;background:var(--white);color:var(--ink);outline:none;box-shadow:0 4px 24px rgba(0,0,0,.28);transition:border-color .2s}
.search-input:focus{border-color:var(--yellow)}
.search-sbtn{position:absolute;right:5px;top:50%;transform:translateY(-50%);background:var(--yellow);border:none;border-radius:3px;padding:.45rem .95rem;font-family:var(--sans);font-size:.75rem;font-weight:700;color:var(--black);cursor:pointer;text-transform:uppercase}
.search-xclear{position:absolute;right:85px;top:50%;transform:translateY(-50%);background:#DDD;border:none;border-radius:50%;width:20px;height:20px;font-size:.58rem;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ink)}

.subbar{background:var(--black2);border-bottom:2px solid var(--yellow);padding:.7rem 1.5rem}
.subbar .search-input{background:#252525;color:var(--white);box-shadow:none;border-color:rgba(255,255,255,.08)}
.subbar .search-input::placeholder{color:rgba(255,255,255,.3)}
.subbar .search-input:focus{border-color:var(--yellow)}

.page{max-width:1120px;margin:0 auto;padding:0 1.5rem}
.shead{display:flex;align-items:center;gap:.875rem;padding:2.5rem 0 1.25rem}
.shead-label{font-family:var(--display);font-size:1rem;letter-spacing:.12em;color:var(--muted);white-space:nowrap}
.shead-rule{flex:1;height:1px;background:var(--rule)}
.shead-action{background:none;border:none;padding:0;font-family:var(--sans);font-size:.73rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:var(--yellow-dark);cursor:pointer;white-space:nowrap}

.cat-grid{display:grid;grid-template-columns:repeat(4,1fr);border:2px solid var(--black);border-radius:6px;overflow:hidden;margin-bottom:2.5rem}
@media(max-width:700px){.cat-grid{grid-template-columns:repeat(2,1fr)}}
.cat-tile{background:var(--black);padding:1.75rem 1.25rem 1.5rem;cursor:pointer;transition:background .13s;border-right:1px solid rgba(255,255,255,.07);position:relative}
.cat-tile:last-child{border-right:none}
.cat-tile:hover{background:#1D1D1D}
.cat-tile:hover .cat-icon-wrap{background:var(--yellow)}
.cat-icon-wrap{width:46px;height:46px;border-radius:6px;background:rgba(245,200,0,.13);display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:.875rem;transition:background .15s}
.cat-label{font-family:var(--display);font-size:1.05rem;letter-spacing:.05em;color:var(--white);margin-bottom:.3rem}
.cat-desc{font-size:.73rem;color:rgba(255,255,255,.38);line-height:1.55}
.cat-count{position:absolute;top:.875rem;right:.875rem;font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--yellow);opacity:.65}

.listing-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:5px;overflow:hidden;margin-bottom:3rem}
@media(max-width:600px){.listing-grid{grid-template-columns:1fr}}
.lcard{background:var(--white);padding:1.25rem;cursor:pointer;transition:background .12s;display:flex;flex-direction:column;gap:.575rem;position:relative}
.lcard:hover{background:#FFFDF5}
.lcard-top{display:flex;align-items:flex-start;gap:.875rem}
.lcard-avatar{width:44px;height:44px;border-radius:4px;background:var(--black);color:var(--yellow);font-family:var(--display);font-size:13px;letter-spacing:.03em;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding-top:1px}
.lcard-name{font-family:var(--serif);font-size:1rem;font-weight:600;line-height:1.25;color:var(--ink)}
.lcard-cat{font-size:.65rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:500;margin-top:.15rem}
.lcard-desc{font-size:.82rem;color:#55504A;line-height:1.65}
.lcard-meta{display:flex;flex-direction:column;gap:.2rem}
.lcard-meta-row{font-size:.74rem;color:var(--muted);display:flex;align-items:center;gap:.35rem}
.feat-dot{position:absolute;top:.95rem;right:.95rem;width:7px;height:7px;border-radius:50%;background:var(--yellow);border:1.5px solid var(--yellow-dark)}

.dpage{max-width:760px;margin:0 auto;padding:2rem 1.5rem 5rem}
.back-btn{display:inline-flex;align-items:center;gap:.4rem;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);background:none;border:none;padding:0;cursor:pointer;margin-bottom:2rem}
.d-header{border-left:4px solid var(--yellow);padding-left:1.25rem;margin-bottom:2rem}
.d-top{display:flex;align-items:center;gap:.9rem;margin-bottom:.625rem}
.d-avatar{width:52px;height:52px;border-radius:5px;background:var(--black);color:var(--yellow);font-family:var(--display);font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding-top:1px}
.d-name{font-family:var(--display);font-size:clamp(1.8rem,5vw,2.4rem);letter-spacing:.03em;line-height:1;color:var(--ink)}
.d-chips{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap}
.d-cat-chip{font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;background:var(--black);color:var(--yellow);padding:.2rem .6rem;border-radius:2px;cursor:pointer}
.d-city-chip{font-size:.67rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}
.d-desc{font-size:1.05rem;line-height:1.85;color:#3A3830;font-weight:300;margin-bottom:2rem;font-family:var(--serif);font-style:italic}
.d-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:1.25rem}
@media(max-width:480px){.d-info-grid{grid-template-columns:1fr}}
.info-cell{background:var(--white);padding:1rem 1.1rem}
.info-lbl{font-size:.62rem;text-transform:uppercase;letter-spacing:.14em;font-weight:700;color:var(--muted);margin-bottom:.35rem}
.info-val{font-size:.88rem;font-weight:500;color:var(--ink);line-height:1.45}
.info-a{color:var(--black);text-decoration:none;border-bottom:1.5px solid var(--yellow)}

.cpage{max-width:1120px;margin:0 auto;padding:2rem 1.5rem 5rem}
.cpage-hero{background:var(--black);border-radius:6px;padding:1.75rem;margin-bottom:2rem;display:flex;align-items:center;gap:1.1rem}
.cpage-icon{width:54px;height:54px;border-radius:8px;background:var(--yellow);display:flex;align-items:center;justify-content:center;font-size:1.65rem;flex-shrink:0}
.cpage-title{font-family:var(--display);font-size:1.85rem;letter-spacing:.04em;color:var(--white);line-height:1;margin-bottom:.25rem}
.cpage-sub{font-size:.75rem;color:rgba(255,255,255,.38);text-transform:uppercase;letter-spacing:.1em;font-weight:500}

.spage{max-width:1120px;margin:0 auto;padding:2rem 1.5rem 5rem}
.spage-title{font-family:var(--display);font-size:1.65rem;letter-spacing:.04em;margin-bottom:.3rem}
.spage-meta{font-size:.75rem;color:var(--muted);margin-bottom:2rem;text-transform:uppercase;letter-spacing:.07em;font-weight:500}

.empty{text-align:center;padding:4rem 1rem;color:var(--muted)}
.empty-icon{font-size:2.5rem;margin-bottom:1rem}
.empty h3{font-family:var(--display);font-size:1.35rem;letter-spacing:.06em;color:var(--ink);margin-bottom:.5rem}
.loading{text-align:center;padding:3rem;font-family:var(--display);font-size:1.2rem;letter-spacing:.1em;color:var(--muted)}

.footer{background:var(--black);border-top:3px solid var(--yellow);padding:2.5rem 1.5rem;text-align:center}
.footer-brand{display:inline-flex;align-items:center;gap:.6rem;margin-bottom:.75rem}
.footer-dimark{width:30px;height:30px;border-radius:50%;background:var(--yellow);border:2px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:11px;color:var(--black);line-height:1;padding-top:1px}
.footer-wm{font-family:var(--display);font-size:1.05rem;letter-spacing:.06em;color:var(--white)}
.footer-tag{font-size:.77rem;color:rgba(255,255,255,.35);margin-bottom:.5rem}
.footer-copy{font-size:.65rem;color:rgba(255,255,255,.18);text-transform:uppercase;letter-spacing:.1em}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .33s ease both}
@media(max-width:600px){.hero{padding:2.5rem 1.25rem 2rem}.nav-loc{display:none}}
`;

function DiMark({ size = 34 }) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:"#F5C800",border:"2px solid rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:size*0.38,color:"#111",lineHeight:1,paddingTop:1,flexShrink:0}}>DI</div>
  );
}

function SearchForm({ value, onChange, onSubmit, inputRef, dark }) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <input ref={inputRef} className="search-input" type="text" placeholder="Search restaurants, businesses, services…" value={value} onChange={(e) => onChange(e.target.value)} style={dark ? {background:"#252525",color:"#fff"} : {}} />
      {value && <button type="button" className="search-xclear" onClick={() => onChange("")}>✕</button>}
      <button type="submit" className="search-sbtn">Go</button>
    </form>
  );
}

function ListingCard({ listing, catName, onClick }) {
  return (
    <div className="lcard fu" onClick={() => onClick(listing.id)}>
      {listing.featured === 1 && <span className="feat-dot" />}
      <div className="lcard-top">
        <div className="lcard-avatar">{listing.initials}</div>
        <div>
          <div className="lcard-name">{listing.name}</div>
          <div className="lcard-cat">{catName}</div>
        </div>
      </div>
      <p className="lcard-desc">{listing.description}</p>
      <div className="lcard-meta">
        <span className="lcard-meta-row">📍 {listing.address ? listing.address.split(",")[0] : ""}</span>
        {listing.phone && <span className="lcard-meta-row">📞 {listing.phone}</span>}
      </div>
    </div>
  );
}

function HomePage({ categories, listings, onCategory, onListing }) {
  const featured = listings.filter((l) => l.featured === 1);
  const countByCat = Object.fromEntries(categories.map((c) => [c.id, listings.filter((l) => l.category_id === c.id).length]));
  const catName = (id) => { const c = categories.find((c) => c.id === id); return c ? c.name : ""; };
  return (
    <div className="page">
      <div className="shead"><span className="shead-label">Browse by Category</span><div className="shead-rule" /></div>
      <div className="cat-grid">
        {categories.map((c) => (
          <div key={c.id} className="cat-tile" onClick={() => onCategory(c.id)}>
            <div className="cat-count">{countByCat[c.id] || 0}</div>
            <div className="cat-icon-wrap">{c.icon}</div>
            <div className="cat-label">{c.name}</div>
            <div className="cat-desc">{c.description}</div>
          </div>
        ))}
      </div>
      <div className="shead"><span className="shead-label">Featured Listings</span><div className="shead-rule" /><button className="shead-action" onClick={() => onCategory(null)}>All listings →</button></div>
      <div className="listing-grid">
        {featured.map((l) => <ListingCard key={l.id} listing={l} catName={catName(l.category_id)} onClick={onListing} />)}
      </div>
    </div>
  );
}

function CategoryPage({ catId, categories, listings, onListing, onBack }) {
  const cat = catId ? categories.find((c) => c.id === catId) : null;
  const filtered = catId ? listings.filter((l) => l.category_id === catId) : listings;
  const catName = (id) => { const c = categories.find((c) => c.id === id); return c ? c.name : ""; };
  return (
    <div className="cpage">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="cpage-hero">
        <div className="cpage-icon">{cat ? cat.icon : "📋"}</div>
        <div>
          <div className="cpage-title">{cat ? cat.name : "All Listings"}</div>
          <div className="cpage-sub">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} · Sanford, NC</div>
        </div>
      </div>
      <div className="listing-grid">
        {filtered.map((l) => <ListingCard key={l.id} listing={l} catName={catName(l.category_id)} onClick={onListing} />)}
      </div>
    </div>
  );
}

function DetailPage({ listingId, categories, onBack, onCategory }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${API}/listings/${listingId}`)
      .then((r) => r.json())
      .then((d) => { setListing(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [listingId]);
  if (loading) return <div className="loading">Loading…</div>;
  if (!listing) return <div className="dpage"><button className="back-btn" onClick={onBack}>← Back</button><div className="empty"><div className="empty-icon">🔍</div><h3>Not found</h3></div></div>;
  const cat = categories.find((c) => c.id === listing.category_id);
  return (
    <div className="dpage fu">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="d-header">
        <div className="d-top">
          <div className="d-avatar">{listing.initials}</div>
          <div className="d-name">{listing.name}</div>
        </div>
        <div className="d-chips">
          <span className="d-cat-chip" onClick={() => onCategory(listing.category_id)}>{cat?.icon} {cat?.name}</span>
          <span className="d-city-chip">Sanford, NC</span>
          {listing.featured === 1 && <span style={{fontSize:".6rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#111",background:"#F5C800",padding:".14rem .42rem",borderRadius:2}}>★ Featured</span>}
        </div>
      </div>
      <p className="d-desc">{listing.description}</p>
      <div className="d-info-grid">
        <div className="info-cell"><div className="info-lbl">Address</div><div className="info-val">{listing.address || "Not listed"}</div></div>
        <div className="info-cell"><div className="info-lbl">Phone</div><div className="info-val">{listing.phone ? <a href={`tel:${listing.phone}`} className="info-a">{listing.phone}</a> : "Not listed"}</div></div>
        <div className="info-cell"><div className="info-lbl">Website</div><div className="info-val">{listing.website ? <a href={listing.website} target="_blank" rel="noopener noreferrer" className="info-a">Visit website →</a> : "Not listed"}</div></div>
        <div className="info-cell"><div className="info-lbl">Category</div><div className="info-val" style={{cursor:"pointer"}} onClick={() => onCategory(listing.category_id)}>{cat?.icon} {cat?.name}</div></div>
      </div>
    </div>
  );
}

function SearchPage({ query, categories, onListing, onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const catName = (id) => { const c = categories.find((c) => c.id === id); return c ? c.name : ""; };
  useEffect(() => {
    fetch(`${API}/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => { setResults(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [query]);
  return (
    <div className="spage">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="spage-title">"{query}"</div>
      <div className="spage-meta">{loading ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""} in Sanford, NC`}</div>
      {!loading && results.length === 0 && <div className="empty"><div className="empty-icon">🔍</div><h3>No results found</h3><p>Try a different keyword or browse by category.</p></div>}
      {!loading && <div className="listing-grid">{results.map((l) => <ListingCard key={l.id} listing={l} catName={catName(l.category_id)} onClick={onListing} />)}</div>}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [activeCat, setActiveCat] = useState(null);
  const [activeListing, setActive] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/categories`).then((r) => r.json()),
      fetch(`${API}/listings`).then((r) => r.json()),
    ]).then(([cats, lists]) => {
      setCategories(cats);
      setListings(lists);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function goHome() { setPage("home"); setActiveCat(null); setActive(null); setInputVal(""); setSearchQ(""); }
  function goCategory(id) { setActiveCat(id); setPage("category"); }
  function goListing(id) { setActive(id); setPage("detail"); }
  function handleSearch(e) { e.preventDefault(); if (inputVal.trim()) { setSearchQ(inputVal.trim()); setPage("search"); } }
  function handleInput(v) { setInputVal(v); if (!v.trim() && page === "search") { setSearchQ(""); setPage("home"); } }

  const isHome = page === "home";

  return (
    <>
      <style>{css}</style>
      <nav className="nav">
        <div className="nav-brand" onClick={goHome}>
          <DiMark size={34} />
          <span className="nav-wordmark">District<em>.</em></span>
        </div>
        <div className="nav-spacer" />
        <div className="nav-loc">Sanford, NC</div>
        <button className="nav-sbtn" onClick={() => inputRef.current?.focus()}>Search</button>
      </nav>

      {isHome && (
        <div className="hero">
          <div className="hero-inner">
            <div className="hero-pill">📍 Sanford, NC · Lee County</div>
            <h1>Your guide to<em>Sanford</em></h1>
            <p className="hero-sub">Where the Sandhills meet the Piedmont. No ads, no algorithms — just the local businesses and community resources that matter.</p>
            <SearchForm value={inputVal} onChange={handleInput} onSubmit={handleSearch} inputRef={inputRef} />
          </div>
        </div>
      )}

      {!isHome && (
        <div className="subbar">
          <SearchForm value={inputVal} onChange={handleInput} onSubmit={handleSearch} inputRef={inputRef} dark />
        </div>
      )}

      {loading && <div className="loading">Loading District Internet…</div>}

      {!loading && page === "home" && <HomePage categories={categories} listings={listings} onCategory={goCategory} onListing={goListing} />}
      {!loading && page === "category" && <CategoryPage catId={activeCat} categories={categories} listings={listings} onListing={goListing} onBack={goHome} />}
      {page === "detail" && <DetailPage listingId={activeListing} categories={categories} onBack={() => activeCat ? goCategory(activeCat) : goHome()} onCategory={goCategory} />}
      {page === "search" && <SearchPage query={searchQ} categories={categories} onListing={goListing} onBack={goHome} />}

      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-dimark">DI</div>
          <span className="footer-wm">District Internet</span>
        </div>
        <div className="footer-tag">Sanford's local directory — no ads, no reviews, no noise.</div>
        <div className="footer-copy">© {new Date().getFullYear()} District Internet · Phase 1 · Sanford, NC</div>
      </footer>
    </>
  );
}