import { Link } from "react-router-dom";
import "./CropInfo.css";

export const CROPS_INFO = [
  {
    slug: "padi",
    name: "Padi",
    scientificName: "Oryza sativa",
    type: "Tanaman Pangan",
    season: "Oktober – Maret",
    sowingTime: "Oktober – November",
    harvestTime: "Maret – April",
    growthPeriod: "90–120 hari",
    climate: "25–35°C, 1500–2000 mm",
    soilType: "Tanah liat / sawah",
    difficulty: "Sedang",
    pesticides: ["Karbofuran", "Klorantraniliprol", "Imidakloprid"],
    fertilizers: ["Urea (N)", "SP-36 (P)", "KCl (K)"],
    imgUrl: "https://msmbindonesia.com/wp-content/uploads/2025/04/Tumbnail-Website-1-scaled-1.jpg",
  },
  {
    slug: "gandum",
    name: "Gandum",
    scientificName: "Triticum aestivum",
    type: "Tanaman Pangan",
    season: "Musim Dingin",
    sowingTime: "Oktober – November",
    harvestTime: "Maret – April",
    growthPeriod: "5–6 bulan",
    climate: "10–25°C, 300–900 mm",
    soilType: "Tanah lempung",
    difficulty: "Sedang",
    pesticides: ["Karbendazim", "Trifloksistrobin", "Propikonazol"],
    fertilizers: ["Nitrogen", "Fosfor", "Kalium"],
    imgUrl: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/11/08082459/ini-bahayanya-konsumsi-gandum-yang-berlebihan-halodoc.jpg.webp",
  },
  {
    slug: "jagung",
    name: "Jagung",
    scientificName: "Zea mays",
    type: "Tanaman Pangan",
    season: "Sepanjang tahun",
    sowingTime: "Maret – April",
    harvestTime: "Juli – Agustus",
    growthPeriod: "75–100 hari",
    climate: "21–34°C, 500–800 mm",
    soilType: "Tanah lempung berpasir",
    difficulty: "Mudah",
    pesticides: ["Bt (Bacillus thuringiensis)", "Klorantraniliprol", "Lambda-sihalotrin"],
    fertilizers: ["Urea (N)", "TSP (P)", "KCl (K)"],
    imgUrl: "https://png.pngtree.com/png-clipart/20241120/original/pngtree-corn-png-image_17271537.png",
  },
  {
    slug: "kedelai",
    name: "Kedelai",
    scientificName: "Glycine max",
    type: "Tanaman Kacang",
    season: "Maret – September",
    sowingTime: "Maret – April",
    harvestTime: "Juli – Agustus",
    growthPeriod: "70–90 hari",
    climate: "20–30°C, 350–700 mm",
    soilType: "Tanah lempung berpasir",
    difficulty: "Sedang",
    pesticides: ["Deltametrin", "Imidakloprid", "Mankozeb"],
    fertilizers: ["Rhizobium (N-fiksasi)", "TSP (P)", "KCl (K)"],
    imgUrl: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2022/03/18063217/isoflavone-kandungan-yang-kaya-pada-kacang-kedelai-halodoc.jpg.webp",
  },
  {
    slug: "tebu",
    name: "Tebu",
    scientificName: "Saccharum officinarum",
    type: "Tanaman Industri",
    season: "Sepanjang tahun",
    sowingTime: "Januari – Februari",
    harvestTime: "Oktober – Desember",
    growthPeriod: "10–12 bulan",
    climate: "20–35°C, 1000–1500 mm",
    soilType: "Tanah lempung dalam",
    difficulty: "Sedang",
    pesticides: ["Karbofuran", "Fipronil", "Atrazin"],
    fertilizers: ["Urea (N)", "SP-36 (P)", "ZA (S)"],
    imgUrl: "https://png.pngtree.com/png-clipart/20250104/original/pngtree-freshly-cut-sugarcane-stalks-png-image_20077924.png",
  },
  {
    slug: "singkong",
    name: "Singkong",
    scientificName: "Manihot esculenta",
    type: "Tanaman Pangan",
    season: "Sepanjang tahun",
    sowingTime: "Awal musim hujan",
    harvestTime: "8–12 bulan setelah tanam",
    growthPeriod: "8–12 bulan",
    climate: "25–29°C, 1000–1500 mm",
    soilType: "Tanah berpasir gembur",
    difficulty: "Mudah",
    pesticides: ["Mankozeb", "Karbendazim", "Abamektin"],
    fertilizers: ["Urea (N)", "SP-36 (P)", "KCl (K)"],
    imgUrl: "https://png.pngtree.com/png-clipart/20250420/original/pngtree-fresh-organic-cassava-roots-slices-tuber-vegetable-food-png-image_20750851.png",
  },
];

function CropInfo() {
  return (
    <div className="ci2__page">
      <div className="ci2__header">
        <h1>🌿 Agricultural Information</h1>
        <p>Panduan lengkap budidaya berbagai jenis tanaman pertanian</p>
      </div>

      <div className="ci2__banner">
        <div className="ci2__banner-text">
          <h2>Panduan Budidaya Tanaman</h2>
          <p>Temukan informasi musim tanam, iklim, jenis tanah, rekomendasi pestisida & pupuk untuk setiap tanaman.</p>
        </div>
        <div className="ci2__banner-icon" aria-hidden="true">📚</div>
      </div>

      <div className="ci2__grid">
        {CROPS_INFO.map((crop) => (
          <Link to={`/crop-info/${crop.slug}`} key={crop.slug} className="ci2__card">
            <div className="ci2__card-img-wrap">
              <img src={crop.imgUrl} alt={crop.name} className="ci2__card-img" />
            </div>
            <div className="ci2__card-body">
              <h2 className="ci2__card-name">{crop.name}</h2>
              <span className="ci2__learn-btn">
                Learn More <span className="ci2__learn-arrow">›</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CropInfo;
