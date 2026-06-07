export default async function loaderDataCity(req, res) {
	const { searchtext, limit, offset } = req.body;
	const jsonresult = {
		searchtext: '',
		nextoffset: 0,
		limit: 0,
		data: []
	};

	const searchStr = (searchtext || '').trim().toLowerCase();
	const lim = isNaN(parseInt(limit, 10)) ? 10 : parseInt(limit, 10);
	const off = isNaN(parseInt(offset, 10)) ? 0 : parseInt(offset, 10);

	let filtered = CITIES;
	if (searchStr) {
		filtered = CITIES.filter(c =>
			c.city_id.toLowerCase().includes(searchStr) ||
			c.city_name.toLowerCase().includes(searchStr)
		);
	}

	// Buat duplikat array sebelum sort untuk menghindari mutasi CITIES
	filtered = [...filtered].sort((a, b) => a.city_name.localeCompare(b.city_name));

	const sliced = filtered.slice(off, off + lim);
	const endofresult = (off + lim) >= filtered.length;

	jsonresult.searchtext = searchtext || '';
	jsonresult.limit = lim;
	jsonresult.nextoffset = !endofresult ? off + lim : null;
	jsonresult.data = sliced;

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(jsonresult));

}



const CITIES = [
	{ "city_id": "JKP", "city_name": "Jakarta Pusat" },
	{ "city_id": "JKU", "city_name": "Jakarta Utara" },
	{ "city_id": "JKB", "city_name": "Jakarta Barat" },
	{ "city_id": "JKS", "city_name": "Jakarta Selatan" },
	{ "city_id": "JKT", "city_name": "Jakarta Timur" },
	{ "city_id": "KPS", "city_name": "Kepulauan Seribu" },
	{ "city_id": "SBY", "city_name": "Surabaya" },
	{ "city_id": "BDG", "city_name": "Bandung" },
	{ "city_id": "SMG", "city_name": "Semarang" },
	{ "city_id": "YOG", "city_name": "Yogyakarta" },
	{ "city_id": "SOC", "city_name": "Surakarta (Solo)" },
	{ "city_id": "MLG", "city_name": "Malang" },
	{ "city_id": "BGR", "city_name": "Bogor" },
	{ "city_id": "DPK", "city_name": "Depok" },
	{ "city_id": "TNG", "city_name": "Tangerang" },
	{ "city_id": "BKS", "city_name": "Bekasi" },
	{ "city_id": "CRB", "city_name": "Cirebon" },
	{ "city_id": "TSM", "city_name": "Tasikmalaya" },
	{ "city_id": "SKB", "city_name": "Sukabumi" },
	{ "city_id": "PWT", "city_name": "Purwokerto" },
	{ "city_id": "TGL", "city_name": "Tegal" },
	{ "city_id": "PKL", "city_name": "Pekalongan" },
	{ "city_id": "SLT", "city_name": "Salatiga" },
	{ "city_id": "KDS", "city_name": "Kudus" },
	{ "city_id": "MGL", "city_name": "Magelang" },
	{ "city_id": "KDR", "city_name": "Kediri" },
	{ "city_id": "MDN", "city_name": "Madiun" },
	{ "city_id": "BLT", "city_name": "Blitar" },
	{ "city_id": "PSR", "city_name": "Pasuruan" },
	{ "city_id": "PBL", "city_name": "Probolinggo" },
	{ "city_id": "MJK", "city_name": "Mojokerto" },
	{ "city_id": "BAT", "city_name": "Batu" },
	{ "city_id": "SRG", "city_name": "Serang" },
	{ "city_id": "CLG", "city_name": "Cilegon" },
	{ "city_id": "TSN", "city_name": "Tangerang Selatan" },
	{ "city_id": "CMH", "city_name": "Cimahi" },
	{ "city_id": "BJR", "city_name": "Banjar" },
	{ "city_id": "SMD", "city_name": "Sumedang" },
	{ "city_id": "GRT", "city_name": "Garut" },
	{ "city_id": "CJR", "city_name": "Cianjur" },
	{ "city_id": "KRW", "city_name": "Karawang" },
	{ "city_id": "PWK", "city_name": "Purwakarta" },
	{ "city_id": "SBG", "city_name": "Subang" },
	{ "city_id": "IMY", "city_name": "Indramayu" },
	{ "city_id": "MJL", "city_name": "Majalengka" },
	{ "city_id": "KNG", "city_name": "Kuningan" },
	{ "city_id": "CMS", "city_name": "Ciamis" },
	{ "city_id": "PND", "city_name": "Pangandaran" },
	{ "city_id": "CLP", "city_name": "Cilacap" },
	{ "city_id": "BMS", "city_name": "Banyumas" },
	{ "city_id": "PBG", "city_name": "Purbalingga" },
	{ "city_id": "BNG", "city_name": "Banjarnegara" },
	{ "city_id": "KBM", "city_name": "Kebumen" },
	{ "city_id": "PWR", "city_name": "Purworejo" },
	{ "city_id": "WSB", "city_name": "Wonosobo" },
	{ "city_id": "BYL", "city_name": "Boyolali" },
	{ "city_id": "KLT", "city_name": "Klaten" },
	{ "city_id": "SKH", "city_name": "Sukoharjo" },
	{ "city_id": "WNG", "city_name": "Wonogiri" },
	{ "city_id": "KRA", "city_name": "Karanganyar" },
	{ "city_id": "SRG_KAB", "city_name": "Sragen" },
	{ "city_id": "GBG", "city_name": "Grobogan" },
	{ "city_id": "BLR", "city_name": "Blora" },
	{ "city_id": "RBG", "city_name": "Rembang" },
	{ "city_id": "PAT", "city_name": "Pati" },
	{ "city_id": "JPR", "city_name": "Jepara" },
	{ "city_id": "DMK", "city_name": "Demak" },
	{ "city_id": "TMG", "city_name": "Temanggung" },
	{ "city_id": "KDL", "city_name": "Kendal" },
	{ "city_id": "BTG", "city_name": "Batang" },
	{ "city_id": "PML", "city_name": "Pemalang" },
	{ "city_id": "BBS", "city_name": "Brebes" },
	{ "city_id": "KLP", "city_name": "Kulon Progo" },
	{ "city_id": "BTL", "city_name": "Bantul" },
	{ "city_id": "GKL", "city_name": "Gunungkidul" },
	{ "city_id": "SLM", "city_name": "Sleman" },
	{ "city_id": "PCT", "city_name": "Pacitan" },
	{ "city_id": "PNG", "city_name": "Ponorogo" },
	{ "city_id": "TGL_KAB", "city_name": "Trenggalek" },
	{ "city_id": "TLG", "city_name": "Tulungagung" },
	{ "city_id": "NGJ", "city_name": "Nganjuk" },
	{ "city_id": "MDB", "city_name": "Madiun (Kabupaten)" },
	{ "city_id": "MGT", "city_name": "Magetan" },
	{ "city_id": "NGW", "city_name": "Ngawi" },
	{ "city_id": "BJN", "city_name": "Bojonegoro" },
	{ "city_id": "TBN", "city_name": "Tuban" },
	{ "city_id": "LMG", "city_name": "Lamongan" },
	{ "city_id": "GSK", "city_name": "Gresik" },
	{ "city_id": "SDA", "city_name": "Sidoarjo" },
	{ "city_id": "JBG", "city_name": "Jombang" },
	{ "city_id": "MJB", "city_name": "Mojokerto (Kabupaten)" },
	{ "city_id": "PSB", "city_name": "Pasuruan (Kabupaten)" },
	{ "city_id": "PRB", "city_name": "Probolinggo (Kabupaten)" },
	{ "city_id": "LMJ", "city_name": "Lumajang" },
	{ "city_id": "JMB", "city_name": "Jember" },
	{ "city_id": "BYW", "city_name": "Banyuwangi" },
	{ "city_id": "BWS", "city_name": "Bondowoso" },
	{ "city_id": "STB", "city_name": "Situbondo" },
	{ "city_id": "BKL", "city_name": "Bangkalan" },
	{ "city_id": "SMP", "city_name": "Sampang" }
]