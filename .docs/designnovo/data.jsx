// Mock data for Dom da Oferta
const MARKETPLACES = {
  amazon: { name: 'Amazon', short: 'AMZ', color: '#FF9900' },
  mercadolivre: { name: 'Mercado Livre', short: 'ML', color: '#FFE600' },
  shopee: { name: 'Shopee', short: 'SHP', color: '#EE4D2D' },
  magalu: { name: 'Magalu', short: 'MGL', color: '#0086FF' },
};

// Placeholder product image generator (subtle striped SVG)
const productImg = (label, hue = 220) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
    <defs><pattern id="p" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="oklch(0.92 0.02 ${hue})"/>
      <line x1="0" y1="0" x2="0" y2="6" stroke="oklch(0.86 0.02 ${hue})" stroke-width="2"/>
    </pattern></defs>
    <rect width="80" height="80" fill="url(#p)"/>
    <text x="40" y="44" text-anchor="middle" font-family="ui-monospace,monospace" font-size="9" fill="oklch(0.45 0.02 ${hue})">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const PENDING_OFFERS = [
  { id: 1, marketplace: 'amazon', title: 'Duracell Carregador de Pilhas Recarregáveis AA e AAA Com 4 Pilhas AA Inclusas – Bivolt', price: 151.90, original: 219.90, date: '08/04/2026', submitted: '2h', img: productImg('battery', 30), category: 'Eletrônicos', link: 'amazon.com.br/dp/B0CR...', message: '' },
  { id: 2, marketplace: 'amazon', title: 'Cadeira de Escritório Presidente Ergonômica NR17', price: 639.89, original: 899.00, date: '08/04/2026', submitted: '3h', img: productImg('chair', 200), category: 'Casa', link: 'amazon.com.br/dp/B0BV...', message: 'Boa pra home office longo' },
  { id: 3, marketplace: 'amazon', title: 'MONDIAL Secador de Cabelos Travel, Golden Rose, 1200W, Bivolt', price: 82.22, original: 129.00, date: '08/04/2026', submitted: '5h', img: productImg('dryer', 350), category: 'Beleza', link: 'amazon.com.br/dp/B07Y...', message: '' },
  { id: 4, marketplace: 'amazon', title: 'Creatina Pura 1kg Dark Lab Monohidratada 100% de Pureza, Sem Sabor', price: 69.90, original: 119.90, date: '08/04/2026', submitted: '6h', img: productImg('creatine', 280), category: 'Suplementos', link: 'amazon.com.br/dp/B0DJ...', message: '' },
  { id: 5, marketplace: 'amazon', title: 'Whey Protein Concentrado, Dux Human Health, Pote (900g), Chocolate Branco', price: 187.80, original: 287.80, date: '08/04/2026', submitted: '7h', img: productImg('whey', 20), category: 'Suplementos', link: 'amazon.com.br/dp/B0CMXOG', message: 'Pra ficar fortão forte forte' },
  { id: 6, marketplace: 'amazon', title: 'Starbucks Espresso Single-Origin Colombia By Nescafé Dolce Gusto, 1 caixa com 10 cápsulas', price: 21.90, original: 32.90, date: '08/04/2026', submitted: '8h', img: productImg('coffee', 50), category: 'Mercado', link: 'amazon.com.br/dp/B09L...', message: '' },
  { id: 7, marketplace: 'amazon', title: 'Truss Shampoo Perfect Alexandre Herchcovitch | Higienização Profunda e Recuperação da Fibra Capilar | 300ml', price: 72.84, original: 109.90, date: '09/04/2026', submitted: '12h', img: productImg('shampoo', 320), category: 'Beleza', link: 'amazon.com.br/dp/B07T...', message: '' },
  { id: 8, marketplace: 'amazon', title: 'Truss Óleo Capilar Nutritivo | Nutrição Profunda e Controle de Frizz | 30ml', price: 59.90, original: 89.00, date: '09/04/2026', submitted: '13h', img: productImg('oil', 60), category: 'Beleza', link: 'amazon.com.br/dp/B08K...', message: '' },
  { id: 9, marketplace: 'amazon', title: 'Pantene Pro-V Miracles Óleo Capilar Milagroso Queratina Nutrição, Brilho E Proteção 95ml', price: 29.00, original: 49.90, date: '09/04/2026', submitted: '14h', img: productImg('pantene', 30), category: 'Beleza', link: 'amazon.com.br/dp/B08H...', message: '' },
  { id: 10, marketplace: 'amazon', title: 'Creatina em Pó Hardcore Integralmedica 100% Pura e Monohidratada – 300g', price: 39.90, original: 79.90, date: '09/04/2026', submitted: '15h', img: productImg('creatine', 280), category: 'Suplementos', link: 'amazon.com.br/dp/B07Q...', message: '' },
  { id: 11, marketplace: 'amazon', title: 'Creatina Mais Mu, Sem Sabor, 100% Pura – 500g', price: 65.50, original: 110.00, date: '09/04/2026', submitted: '16h', img: productImg('creatine', 280), category: 'Suplementos', link: 'amazon.com.br/dp/B0CR...', message: '' },
  { id: 12, marketplace: 'amazon', title: 'Acidificante Capilar ACID 200g Sela Cutículas e Reduz Frizz', price: 53.27, original: 79.90, date: '09/04/2026', submitted: '17h', img: productImg('acid', 280), category: 'Beleza', link: 'amazon.com.br/dp/B0BX...', message: '' },
  { id: 13, marketplace: 'amazon', title: 'Eudora Eudora Siäge Men Cachos Spray Ativador de Cachos 100ml', price: 25.00, original: 39.90, date: '10/04/2026', submitted: '1d', img: productImg('spray', 200), category: 'Beleza', link: 'amazon.com.br/dp/B09F...', message: '' },
  { id: 14, marketplace: 'mercadolivre', title: 'Creatina Monohidratada 1kg Soldiers Nutrition 100% Pura Importada Alta Performance Músculo Treino', price: 64.90, original: 149.90, date: '30/04/2026', submitted: '2d', img: productImg('creatine', 280), category: 'Suplementos', link: 'mercadolivre.com.br/MLB-12...', message: '' },
  { id: 15, marketplace: 'mercadolivre', title: 'Creatina Monohidratada 250g Growth Supplements – Sem sabor em Pó', price: 39.90, original: 69.90, date: '30/04/2026', submitted: '2d', img: productImg('creatine', 280), category: 'Suplementos', link: 'mercadolivre.com.br/MLB-34...', message: '' },
  { id: 16, marketplace: 'mercadolivre', title: 'Beta Alanina Pura 500g Soldiers Nutrition Treino Performance Força', price: 42.90, original: 89.90, date: '30/04/2026', submitted: '2d', img: productImg('beta', 100), category: 'Suplementos', link: 'mercadolivre.com.br/MLB-56...', message: '' },
  { id: 17, marketplace: 'mercadolivre', title: 'Pré-Treino Evolution Workout 300g Termogênico Sabor Limonada Suíça Soldiers Nutrition Energia Foco Treino', price: 45.90, original: 79.90, date: '30/04/2026', submitted: '3d', img: productImg('pretreino', 100), category: 'Suplementos', link: 'mercadolivre.com.br/MLB-78...', message: '' },
  { id: 18, marketplace: 'mercadolivre', title: 'Whey Pro Baunilha Max Titanium Protein Pro Com Bcaa E Aminoácidos 1kg Sabor Baunilha', price: 89.89, original: 159.90, date: '30/04/2026', submitted: '3d', img: productImg('whey', 20), category: 'Suplementos', link: 'mercadolivre.com.br/MLB-91...', message: '' },
];

const APPROVED_OFFERS = [
  { id: 101, marketplace: 'amazon', title: 'Echo Dot 5ª Geração Smart Speaker com Alexa', price: 279.00, original: 499.00, date: '07/04/2026', approvedBy: 'Dom', approvedAt: '07/04 14:32', clicks: 142, img: productImg('echo', 220), category: 'Eletrônicos' },
  { id: 102, marketplace: 'amazon', title: 'Kindle 11ª Geração 16GB Wi-Fi Preto', price: 449.00, original: 599.00, date: '07/04/2026', approvedBy: 'Esposa', approvedAt: '07/04 11:18', clicks: 89, img: productImg('kindle', 220), category: 'Eletrônicos' },
  { id: 103, marketplace: 'mercadolivre', title: 'Air Fryer Mondial 4L AF-14 Preta 220V', price: 249.90, original: 399.90, date: '06/04/2026', approvedBy: 'Dom', approvedAt: '06/04 19:45', clicks: 312, img: productImg('airfryer', 0), category: 'Casa' },
  { id: 104, marketplace: 'amazon', title: 'Logitech MX Master 3S Mouse Sem Fio Performance', price: 599.00, original: 849.00, date: '06/04/2026', approvedBy: 'Dom', approvedAt: '06/04 10:02', clicks: 67, img: productImg('mouse', 240), category: 'Eletrônicos' },
  { id: 105, marketplace: 'shopee', title: 'Tênis Nike Revolution 7 Masculino Corrida', price: 199.99, original: 349.99, date: '05/04/2026', approvedBy: 'Esposa', approvedAt: '05/04 16:30', clicks: 203, img: productImg('shoe', 180), category: 'Moda' },
  { id: 106, marketplace: 'amazon', title: 'JBL Tune 510BT Fone de Ouvido Bluetooth', price: 199.00, original: 349.00, date: '05/04/2026', approvedBy: 'Dom', approvedAt: '05/04 09:15', clicks: 178, img: productImg('jbl', 240), category: 'Eletrônicos' },
  { id: 107, marketplace: 'mercadolivre', title: 'Cafeteira Nespresso Essenza Mini Preta', price: 379.00, original: 549.00, date: '04/04/2026', approvedBy: 'Esposa', approvedAt: '04/04 21:08', clicks: 95, img: productImg('nespresso', 30), category: 'Casa' },
  { id: 108, marketplace: 'amazon', title: 'Smart TV Samsung 50" Crystal UHD 4K', price: 2299.00, original: 3299.00, date: '04/04/2026', approvedBy: 'Dom', approvedAt: '04/04 15:42', clicks: 421, img: productImg('tv', 220), category: 'Eletrônicos' },
];

const REJECTED_OFFERS = [
  { id: 201, marketplace: 'amazon', title: 'Suplemento "Milagroso" Para Emagrecer 30 Cápsulas', price: 89.90, original: 89.90, date: '07/04/2026', rejectedBy: 'Dom', rejectedAt: '07/04 14:01', reason: 'Sem desconto real', img: productImg('?', 30) },
  { id: 202, marketplace: 'mercadolivre', title: 'iPhone 13 Pro 128GB Lacrado Original', price: 1899.00, original: 7999.00, date: '06/04/2026', rejectedBy: 'Dom', rejectedAt: '06/04 12:30', reason: 'Suspeita de fraude', img: productImg('?', 200) },
  { id: 203, marketplace: 'shopee', title: 'Anabolizante Natural Crescimento Muscular Rápido', price: 49.90, original: 99.90, date: '06/04/2026', rejectedBy: 'Esposa', rejectedAt: '06/04 09:12', reason: 'Produto inadequado', img: productImg('?', 30) },
  { id: 204, marketplace: 'amazon', title: 'Carregador Universal Compatível Todos os Celulares', price: 19.90, original: 24.90, date: '05/04/2026', rejectedBy: 'Dom', rejectedAt: '05/04 18:55', reason: 'Desconto irrelevante (20%)', img: productImg('chrgr', 60) },
  { id: 205, marketplace: 'mercadolivre', title: 'Camiseta Básica 100% Algodão Tamanho M', price: 29.90, original: 35.00, date: '04/04/2026', rejectedBy: 'Esposa', rejectedAt: '04/04 14:22', reason: 'Categoria fora do nicho', img: productImg('shirt', 280) },
];

const ALL_OFFERS = [...PENDING_OFFERS, ...APPROVED_OFFERS, ...REJECTED_OFFERS];

const MEMBERS = [
  { id: 1, name: 'Dom', email: 'dom@domdaoferta.com', role: 'Owner', avatar: 'D', color: 'oklch(0.55 0.18 290)', joinedAt: '01/01/2024', stats: { approved: 1284, rejected: 312, pending: 0 }, lastActive: 'Agora' },
  { id: 2, name: 'Esposa', email: 'esposa@domdaoferta.com', role: 'Admin', avatar: 'E', color: 'oklch(0.65 0.15 30)', joinedAt: '01/01/2024', stats: { approved: 892, rejected: 145, pending: 0 }, lastActive: '12 min' },
  { id: 3, name: 'Lucas Mendes', email: 'lucas@gmail.com', role: 'Curador', avatar: 'L', color: 'oklch(0.6 0.15 200)', joinedAt: '14/02/2025', stats: { approved: 423, rejected: 89, pending: 7 }, lastActive: '2h' },
  { id: 4, name: 'Marina Costa', email: 'marina@gmail.com', role: 'Curador', avatar: 'M', color: 'oklch(0.62 0.15 150)', joinedAt: '03/06/2025', stats: { approved: 287, rejected: 51, pending: 4 }, lastActive: '1d' },
  { id: 5, name: 'Pedro Silva', email: 'pedro@gmail.com', role: 'Submetedor', avatar: 'P', color: 'oklch(0.6 0.15 60)', joinedAt: '20/09/2025', stats: { approved: 142, rejected: 38, pending: 12 }, lastActive: '4h' },
  { id: 6, name: 'Ana Paula', email: 'anap@gmail.com', role: 'Submetedor', avatar: 'A', color: 'oklch(0.62 0.15 340)', joinedAt: '11/11/2025', stats: { approved: 89, rejected: 22, pending: 3 }, lastActive: '6h' },
];

window.MARKETPLACES = MARKETPLACES;
window.PENDING_OFFERS = PENDING_OFFERS;
window.APPROVED_OFFERS = APPROVED_OFFERS;
window.REJECTED_OFFERS = REJECTED_OFFERS;
window.ALL_OFFERS = ALL_OFFERS;
window.MEMBERS = MEMBERS;
