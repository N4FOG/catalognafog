// ═══════════════════════════════════════════════════════════════
//  BASE DE DADOS DOS 32 PRODUTOS OFICIAIS
// ═══════════════════════════════════════════════════════════════
import type { Product } from '../types/product';

export const PRODUTOS: Product[] = [
  {
    "id": 1,
    "nome": "Kapina Plus (60ml)",
    "categoria": "gramados",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Elimina folhas largas e tiriricas em Grama Esmeralda",
    "para_que_serve": "Desinfestante seletivo sistêmico desenvolvido exclusivamente para gramados de Grama Esmeralda. É a solução definitiva para eliminar ervas daninhas de folhas largas e tiriricas sem danificar o gramado.",
    "como_age": "Ação sistêmica profunda: é absorvido pelas folhas e translocado até a raiz das ervas invasoras. As plantas daninhas começam a amarelar em 7 a 10 dias e morrem completamente pela raiz.",
    "como_usar": "Diluir a dosagem indicada (média de 3ml a 5ml por litro de água) em pulverizador costal ou manual. Pulverizar uniformemente sobre as folhas das invasoras com o solo úmido.",
    "onde_nao_usar": "NUNCA utilizar em gramados de folhas largas (Grama Batatais, São Carlos, Santo Agostinho) ou em canteiros com plantas do gênero Arachis (amendoim forrageiro), pois irá dessecar essas espécies.",
    "seguranca": {
      "pets": "Aguardar a secagem completa da calda na grama (cerca de 2 horas) antes de liberar animais de estimação e crianças.",
      "chuva": "Necessita de no mínimo 2 a 3 horas sem chuva após a aplicação para absorção foliar completa.",
      "horario": "Aplicar preferencialmente no final da tarde (após as 16h) ou pela manhã fresca.",
      "epi": "Utilizar luvas de borracha, máscara de proteção e botas durante o preparo e pulverização."
    },
    "alvos": [
      "amendoim bravo",
      "avencas",
      "quebra pedra rasteiro",
      "trapoeraba",
      "buva",
      "desmodium",
      "ciperaceas",
      "erva de santa luzia",
      "folhas largas",
      "grama esmeralda"
    ],
    "descricao": "Desinfestante seletivo sistêmico para controle de ervas de folhas largas em gramados de grama esmeralda.",
    "caracteristicas": [
      "Ação sistêmica profunda",
      "Exclusivo para grama esmeralda",
      "Elimina folhas largas e tiriricas",
      "Frasco 60ml (Caixa c/ 60 frascos)",
      "Líder de mercado em gramados"
    ],
    "imagens": [
      "img/produtos/p01-kapina-plus-60ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KP-PLUS-60",
    "rendimento": "Rende até 100 a 150 litros de calda de pulverização.",
    "destaque": true,
    "preco_base": 89.9
  },
  {
    "id": 2,
    "nome": "Kapina Tradicional (60ml)",
    "categoria": "gramados",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Mata Tiririca com raiz/batatinha sem queimar a grama",
    "para_que_serve": "O herbicida seletivo consagrado no Brasil para erradicação de Cyperáceas (Tiririca) em gramados residenciais e comerciais de folhas estreitas.",
    "como_age": "Penetra na folhagem da tiririca e atinge os rizomas, tubérculos subterrâneos (batatinhas e cebolinhas), impedindo definitivamente a rebrota da praga.",
    "como_usar": "Diluir em água limpa conforme a dosagem recomendada e pulverizar sobre as folhas da tiririca. Manter o gramado bem irrigado nos dias seguintes para favorecer a absorção.",
    "onde_nao_usar": "Não aplicar em dias de seca extrema ou sobre gramados recém-plantados (menos de 45 dias de plantio).",
    "seguranca": {
      "pets": "Liberar a circulação de cães e gatos após a secagem completa das folhas (2 horas).",
      "chuva": "Período de carência de chuva de 2 horas após a aplicação.",
      "horario": "Aplicar nas horas mais frescas do dia (manhã ou após as 16h).",
      "epi": "Luvas impermeáveis e óculos de proteção na manipulação da calda."
    },
    "alvos": [
      "tiririca",
      "cyperaceas",
      "rizomas",
      "batatinhas",
      "cebolinhas",
      "folhas estreitas",
      "grama esmeralda",
      "gramados"
    ],
    "descricao": "Desinfestante seletivo para controle de Cyperáceas (tiririca) eliminando rizomas (batatinhas/cebolinhas).",
    "caracteristicas": [
      "Elimina rizomas e bulbos",
      "Não provoca fito no gramado",
      "Específico para folhas estreitas",
      "Frasco 60ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p02-kapina-tradicional-60ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KP-TRAD-60",
    "rendimento": "Rende até 100 litros de calda (trata áreas médias de gramado).",
    "destaque": true,
    "preco_base": 78.5
  },
  {
    "id": 3,
    "nome": "Korsário (60ml)",
    "categoria": "gramados",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Elimina 100% da Roseta (raiz e folhas) em qualquer gramado",
    "para_que_serve": "Desenvolvido especificamente para erradicar a Roseta (espinho de roseta) que machuca pés e patas de animais em jardins e campos esportivos.",
    "como_age": "Ação 200%: paralisa o desenvolvimento e desseca 100% da raiz e 100% das partes aéreas da roseta, evitando novas sementes.",
    "como_usar": "Pulverizar pontualmente sobre as rosetas ou em área total quando houver infestação generalizada no gramado.",
    "onde_nao_usar": "Não misturar com adubos foliares altamente nitrogenados no mesmo momento da aplicação.",
    "seguranca": {
      "pets": "Reentrada de animais e pessoas após secagem da calda (2h).",
      "chuva": "Resiste à chuva após 2 horas de aplicado.",
      "horario": "Fim de tarde ou manhã sem orvalho excessivo.",
      "epi": "Luvas de proteção e máscara facial."
    },
    "alvos": [
      "roseta",
      "espinho de roseta",
      "ervas daninhas",
      "partes aereas",
      "raiz",
      "gramados"
    ],
    "descricao": "Controle TOTAL da Roseta em todos os tipos de gramados. Ação 200%: elimina 100% raiz e 100% partes aéreas.",
    "caracteristicas": [
      "Controle TOTAL da Roseta",
      "Seletivo para todos os gramados",
      "Elimina raiz e folhas",
      "Frasco 60ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p03-korsario-60ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KOR-60",
    "rendimento": "Trata de 150m² a 300m² dependendo do nível de infestação.",
    "destaque": false,
    "preco_base": 84
  },
  {
    "id": 4,
    "nome": "Katana (30ml)",
    "categoria": "gramados",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Único para Capim Pé-de-Galinha, Colchão e Braquiária",
    "para_que_serve": "O ÚNICO herbicida do mercado brasileiro capaz de eliminar capins de folha fina invasores (Brachiaria, Capim Pé-de-Galinha, Capim Colchão) dentro de gramados de Grama Esmeralda e Bermuda sem matar a grama boa.",
    "como_age": "Inibe a enzima ALS nas invasoras de folha fina. A invasora para de crescer imediatamente, amarela e desaparece em 15 a 20 dias.",
    "como_usar": "Obrigatório aplicar após as 16h em dias quentes. Diluir em pulverizador costal e molhar bem a folha das invasoras.",
    "onde_nao_usar": "NUNCA aplicar antes das 16h sob sol forte (risco de fitotoxicidade momentânea nas pontas) e não utilizar em gramas de folha larga.",
    "seguranca": {
      "pets": "Reentrada de pets permitida após secagem total das folhas (cerca de 2 horas).",
      "chuva": "Necessita de 3 horas sem chuva para fixação.",
      "horario": "APENAS APÓS AS 16H (fundamental para a seletividade).",
      "epi": "Luvas de nitrila e máscara de proteção respiratória."
    },
    "alvos": [
      "brachiaria",
      "braquiaria",
      "capim pe de galinha",
      "capim colchao",
      "folhas finas",
      "grama esmeralda",
      "grama bermuda"
    ],
    "descricao": "Único no Brasil para controle de folhas finas em gramados: Brachiaria, Capim pé de galinha e Capim colchão.",
    "caracteristicas": [
      "Único para folhas finas no Brasil",
      "Controla Brachiaria e Pé de Galinha",
      "Grama Esmeralda e Bermuda",
      "Frasco 30ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p04-katana-30ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KAT-30",
    "rendimento": "Frasco de 30ml rende até 60 a 100 litros de calda.",
    "destaque": true,
    "preco_base": 98
  },
  {
    "id": 5,
    "nome": "Kcura Fungicida (100ml)",
    "categoria": "gramados",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Combate fungos de solo e manchas foliares no gramado",
    "para_que_serve": "Fungicida de amplo espectro para recuperação de gramados e jardins atacados por manchas amarelas, podridões e fungos radiculares.",
    "como_age": "Ação preventiva e curativa sistêmica: bloqueia a proliferação dos esporos e protege as raízes e brotos novos.",
    "como_usar": "Diluir em água e aplicar no gramado afetado, molhando tanto as folhas quanto a base do solo.",
    "onde_nao_usar": "Evitar aplicar sobre solo excessivamente encharcado por chuva torrencial.",
    "seguranca": {
      "pets": "Aguardar 2h após a aplicação (secagem da folhagem).",
      "chuva": "Resiste à chuva após 3 horas.",
      "horario": "Início da manhã ou fim de tarde.",
      "epi": "Luvas impermeáveis e máscara."
    },
    "alvos": [
      "fungos",
      "mancha foliar",
      "antracnose",
      "podridao de raiz",
      "doencas fungicas",
      "gramado",
      "jardim"
    ],
    "descricao": "Fungicida de amplo espectro para controle preventivo e curativo de doenças aéreas e de solo em gramados.",
    "caracteristicas": [
      "Amplo espectro de ação",
      "Ação aérea e de solo",
      "Curativo e preventivo",
      "Frasco 100ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p05-kcura-fungicida-100ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KCURA-100",
    "rendimento": "Trata até 300m² de gramado.",
    "destaque": false,
    "preco_base": 42
  },
  {
    "id": 6,
    "nome": "Roçada (100ml)",
    "categoria": "nao-seletivos",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Limpeza total pós e pré-emergente de terrenos (300m²)",
    "para_que_serve": "Desinfestante completo para limpeza profunda de terrenos baldios, beiras de muros, pátios de terra e áreas sem cultivo. Contém óleo mineral e sulfato de amônia.",
    "como_age": "Age em pós e pré-emergência: mata o mato verde e cria uma camada que inibe o nascimento de novas sementes por até 90 dias. Sem POEA.",
    "como_usar": "Diluir 100ml em 20L de água (1 pulverizador costal) e pulverizar uniformemente sobre a vegetação a ser eliminada.",
    "onde_nao_usar": "NUNCA aplicar sobre gramados ou perto de raízes de árvores frutíferas e flores decorativas.",
    "seguranca": {
      "pets": "Isolar animais de estimação até que a área aplicada esteja 100% seca (mínimo 2 a 3 horas).",
      "chuva": "Resistente à chuva após 2 horas de sol.",
      "horario": "Aplicar em dias ensolarados com solo seco.",
      "epi": "Calça comprida, botas impermeáveis, luvas e máscara."
    },
    "alvos": [
      "capina total",
      "limpeza de terreno",
      "mato",
      "folhas largas",
      "folhas estreitas",
      "terrenos baldios",
      "pos emergente",
      "pre emergente"
    ],
    "descricao": "Desinfestante completo pós e pré-emergente com óleo mineral, sulfato de amônia e espalhante. Rende 300m².",
    "caracteristicas": [
      "Pós e Pré Emergente",
      "Até 90 dias de área limpa",
      "Rende 300m² por frasco",
      "Sem POEA (mais seguro)",
      "Frasco 100ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p06-rocada-100ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "ROC-100",
    "rendimento": "Rendimento garantido de 300m² por frasco de 100ml.",
    "destaque": true,
    "preco_base": 38
  },
  {
    "id": 7,
    "nome": "ArranKa EW (100ml)",
    "categoria": "nao-seletivos",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Desinfestação urbana com Sulfato de Potássio (300m²)",
    "para_que_serve": "Desinfestante não seletivo concentrado para desinfestação urbana e limpeza de calçadas, paralelepípedos e canteiros industriais.",
    "como_age": "Formulação especial com Sulfato de Potássio e espalhante integrado de absorção rápida. Seca folhas largas e estreitas.",
    "como_usar": "Diluir em pulverizador manual ou costal e aplicar nas frestas e folhagens das ervas.",
    "onde_nao_usar": "Não borrifar sobre gramados ornamentais ou plantas cultivadas.",
    "seguranca": {
      "pets": "Aguardar secagem total (2 horas).",
      "chuva": "Exige 2 horas sem chuva pós pulverização.",
      "horario": "Dias ensolarados e sem ventos fortes.",
      "epi": "Luvas e máscara de proteção."
    },
    "alvos": [
      "desinfestacao urbana",
      "mato",
      "folhas estreitas",
      "folhas largas",
      "calcadas",
      "canteiros",
      "muralhas",
      "capina"
    ],
    "descricao": "Desinfestante não seletivo com Sulfato de Potássio e espalhante adesivo para desinfestação urbana.",
    "caracteristicas": [
      "Com espalhante adesivo",
      "Sulfato de Potássio",
      "Rendimento de 300m²",
      "Frasco 100ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p07-arranka-ew-100ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "ARR-EW-100",
    "rendimento": "Trata até 300m² de área.",
    "destaque": false,
    "preco_base": 46
  },
  {
    "id": 8,
    "nome": "ArranKa Pronto Uso (1 Litro)",
    "categoria": "nao-seletivos",
    "tipo_formulacao": "pronto-uso",
    "o_que_faz": "Capina total imediata sem precisar diluir (300m²)",
    "para_que_serve": "A solução mais prática para capina e limpeza de calçadas, muros e frestas. Já vem pronto no pulverizador de 1 Litro, sem necessidade de medir água ou manusear produtos concentrados.",
    "como_age": "Desinfestante NÃO SELETIVO: elimina qualquer planta verde com que tiver contato. Seca a planta da folha até a raiz em 10 a 15 dias.",
    "como_usar": "Agite o frasco e borrife diretamente nas folhas do mato indesejado até cobrir a superfície foliar.",
    "onde_nao_usar": "NUNCA pulverize por cima do gramado, pois matará a grama. Em caso de mato no meio da grama, aplique de forma pontual a 5cm da folha da invasora.",
    "seguranca": {
      "pets": "Aguardar secagem da calda nas calçadas (1 a 2 horas).",
      "chuva": "Não aplicar se houver previsão de chuva em 2 horas.",
      "horario": "Qualquer hora com sol e sem vento.",
      "epi": "Pronto uso seguro (recomenda-se luvas domésticas)."
    },
    "alvos": [
      "mato",
      "ervas invasoras",
      "capina",
      "folhas largas",
      "folhas estreitas",
      "calcadas",
      "jardins",
      "pronto uso"
    ],
    "descricao": "Desinfestante sistêmico pronto para uso. Elimina plantas de folhas largas e estreitas sem precisar diluir.",
    "caracteristicas": [
      "Pronto para uso (sem diluição)",
      "Frasco econômico de 1 Litro",
      "Rendimento de 300m²",
      "Caixa com 12 frascos"
    ],
    "imagens": [
      "img/produtos/p08-arranka-pronto-uso-1l.webp"
    ],
    "unidade": "frasco",
    "referencia": "ARR-PU-1L",
    "rendimento": "Frasco de 1L cobre até 300m² de calçadas e frestas.",
    "destaque": true,
    "preco_base": 35
  },
  {
    "id": 9,
    "nome": "Bravick Fungicida Concentrado (10ml)",
    "categoria": "fungicidas",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Cura e previne fungos, oídio e podridão em orquídeas e flores",
    "para_que_serve": "O fungicida nº 1 no cuidado de orquídeas, rosas, samambaias e folhagens ornamentais. Elimina manchas pretas, oídios, ferrugens e podridão negra.",
    "como_age": "Fungicida sistêmico curativo e preventivo: penetra nas folhas e raízes, curando infecções ativas e blindando a planta contra novos ataques.",
    "como_usar": "Diluir poucas gotas por litro de água (conforme tabela) e pulverizar sobre as folhas atacadas a cada 15 dias.",
    "onde_nao_usar": "Não aplicar sobre pétalas de flores totalmente abertas em exposição solar forte.",
    "seguranca": {
      "pets": "Seguro para ambientes residenciais após a secagem.",
      "chuva": "Resiste à chuva após 2 horas da aplicação.",
      "horario": "Início da manhã (ideal para plantas ornamentais).",
      "epi": "Luvas leves para jardinagem."
    },
    "alvos": [
      "fungos",
      "orquideas",
      "manchas foliares",
      "oidio",
      "ferrugem",
      "podridao negra",
      "plantas ornamentais",
      "flores",
      "rosas"
    ],
    "descricao": "N° 1 do mercado no combate e controle completo de fungos e doenças em plantas ornamentais e orquídeas.",
    "caracteristicas": [
      "Fungicida sistêmico de amplo espectro",
      "Ideal para plantas ornamentais e flores",
      "Preventivo e curativo",
      "Frasco 10ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p09-bravick-fungicida-10ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "BRAV-10",
    "rendimento": "Frasco de 10ml rende até 20 a 30 litros de calda protetora.",
    "destaque": true,
    "preco_base": 24
  },
  {
    "id": 10,
    "nome": "Bravick Pronto Uso (240ml Spray)",
    "categoria": "fungicidas",
    "tipo_formulacao": "pronto-uso",
    "o_que_faz": "Spray protetor pronto para rosas e plantas ornamentais",
    "para_que_serve": "Versão prática em gatilho spray do fungicida Bravick para quem cultiva vasos, jardins verticais e orquidários em apartamentos e casas.",
    "como_age": "Cura fungos foliares rapidamente sem queimar a folhagem delicada das plantas ornamentais.",
    "como_usar": "Borrifar diretamente sobre as folhas manchadas e caules a uma distância de 20cm.",
    "onde_nao_usar": "Evitar encharcar excessivamente o substrato.",
    "seguranca": {
      "pets": "Seguro para uso doméstico após secagem.",
      "chuva": "Proteger vasos da chuva nas primeiras 2 horas.",
      "horario": "Pela manhã ou final de tarde.",
      "epi": "Não requer EPI complexo (venda livre)."
    },
    "alvos": [
      "fungos",
      "manchas foliares",
      "oidio",
      "plantas ornamentais",
      "folhagens",
      "flores",
      "orquideas",
      "rosas",
      "samambaias"
    ],
    "descricao": "Fungicida sistêmico pronto para uso com aplicador spray para plantas ornamentais.",
    "caracteristicas": [
      "Gatilho spray pronto uso",
      "Não precisa diluir",
      "Frasco 240ml (Caixa c/ 24 frascos)"
    ],
    "imagens": [
      "img/produtos/p10-bravick-pronto-uso-240ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "BRAV-PU-240",
    "rendimento": "Trata dezenas de vasos e plantas em recipientes.",
    "destaque": false,
    "preco_base": 28
  },
  {
    "id": 11,
    "nome": "Ka-Bio Fitoterápico Natural (60ml)",
    "categoria": "fungicidas",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "100% Natural contra pulgões, cochonilhas e lagartas",
    "para_que_serve": "Solução fitoterápica 100% ecológica para controle de pragas em hortas orgânicas, pomares e plantas de consumo sem agrotóxicos pesados.",
    "como_age": "Atua por contato e repelência natural contra insetos mastigadores, sugadores e raspadores (pulgões, tripes, lagartas e mosca-branca).",
    "como_usar": "Diluir em água limpa e pulverizar sobre a horta e plantas frutíferas quinzenalmente.",
    "onde_nao_usar": "Produto de venda livre e seguro sem restrições severas.",
    "seguranca": {
      "pets": "100% Seguro para cães, gatos e pássaros.",
      "chuva": "Por ser natural, reaplicar caso chova forte no mesmo dia.",
      "horario": "Fim de tarde (evita estresse na folha da horta).",
      "epi": "Produto ecológico de venda livre."
    },
    "alvos": [
      "pulgoes",
      "cochonilhas",
      "tripes",
      "lagartas",
      "insetos sugadores",
      "mastigadores",
      "horta",
      "organico",
      "natural",
      "fitoterapico",
      "mosca branca"
    ],
    "descricao": "Produto tradicional fitoterápico 100% natural para prevenção e controle de insetos mastigadores, raspadores e sugadores.",
    "caracteristicas": [
      "100% Natural Fitoterápico",
      "Controle de mastigadores e sugadores",
      "Venda livre e ecológico",
      "Frasco 60ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p11-ka-bio-fitoterapico-60ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KABIO-60",
    "rendimento": "Rende de 30 a 60 litros de calda natural.",
    "destaque": false,
    "preco_base": 52
  },
  {
    "id": 12,
    "nome": "Ka-Bio Pronto Uso (240ml Spray)",
    "categoria": "fungicidas",
    "tipo_formulacao": "pronto-uso",
    "o_que_faz": "Spray fitoterápico pronto para vasos e hortas caseiras",
    "para_que_serve": "Defensivo natural pronto em frasco spray para quem tem horta na varanda, vasinhos de temperos (manjericão, alecrim, pimentas) e flores.",
    "como_age": "Combate pulgões e cochonilhas de forma rápida e segura sem deixar resíduos químicos nocivos.",
    "como_usar": "Borrifar direto nas pragas visíveis e folhas atacadas.",
    "onde_nao_usar": "Seguro para todas as culturas domésticas.",
    "seguranca": {
      "pets": "Totalmente seguro para ambientes familiares.",
      "chuva": "Reaplicar após chuva forte.",
      "horario": "Fim de tarde.",
      "epi": "Isento de toxicidade agressiva."
    },
    "alvos": [
      "pulgoes",
      "cochonilhas",
      "tripes",
      "lagartas",
      "hortas caseiras",
      "pomar",
      "plantas em vasos",
      "organico",
      "natural"
    ],
    "descricao": "Solução fitoterápica natural pronta para aplicação em spray para hortas, jardins e frutíferas.",
    "caracteristicas": [
      "Pronto uso com gatilho spray",
      "Fitoterápico natural",
      "Frasco 240ml (Caixa c/ 24 frascos)"
    ],
    "imagens": [
      "img/produtos/p12-ka-bio-pronto-uso-240ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KABIO-PU-240",
    "rendimento": "Rende centenas de borrifadas práticas.",
    "destaque": false,
    "preco_base": 32
  },
  {
    "id": 13,
    "nome": "Impakto Inseticida (250ml e 500ml)",
    "categoria": "inseticidas",
    "tipo_formulacao": "pronto-uso",
    "o_que_faz": "Inseticida sem cheiro para aranhas, baratas e cupins",
    "para_que_serve": "Inseticida de choque e ação deletéria para residências, escritórios e comércios. Elimina aranhas, baratas, formigas e cupins.",
    "como_age": "Ação rápida por contato e ingestão com efeito residual prolongado. Não tem cheiro e não mancha pisos, azulejos ou rodapés.",
    "como_usar": "Aplicar em rodapés, frestas, atrás de armários e locais de abrigo das pragas.",
    "onde_nao_usar": "Não aplicar diretamente sobre alimentos ou utensílios de cozinha.",
    "seguranca": {
      "pets": "Aguardar 2 horas de secagem do piso antes de liberar pets.",
      "chuva": "Ideal para ambientes internos e abrigados.",
      "horario": "Qualquer horário.",
      "epi": "Luvas de proteção."
    },
    "alvos": [
      "aranhas",
      "baratas",
      "cupins",
      "formigas",
      "cascudinho",
      "pragas urbanas",
      "sem cheiro",
      "nao mancha"
    ],
    "descricao": "Inseticida de ação deletéria pronto uso para ambientes domésticos. Elimina aranhas, baratas, cupins e formigas.",
    "caracteristicas": [
      "Ação deletéria rápida",
      "Não mancha e não tem cheiro",
      "Residual prolongado",
      "Frascos 250ml e 500ml"
    ],
    "imagens": [
      "img/produtos/p13-impakto-inseticida.webp"
    ],
    "unidade": "frasco",
    "referencia": "IMP-250-500",
    "rendimento": "Frascos de 250ml e 500ml com alto rendimento.",
    "destaque": true,
    "preco_base": 48
  },
  {
    "id": 14,
    "nome": "Fimo Combina Spray (40ml e 120ml)",
    "categoria": "inseticidas",
    "tipo_formulacao": "pronto-uso",
    "o_que_faz": "Spray com atrativo especial e residual de até 6 meses",
    "para_que_serve": "Inseticida inovador que atrai as pragas até a área tratada, dispensando a necessidade de acertar o inseto no momento da aplicação.",
    "como_age": "Contém atrativo alimentar e sexual. O inseto caminha sobre a superfície tratada, contamina-se e morre. Residual de até 180 dias.",
    "como_usar": "Borrife nos cantos escuros, frestas de portas, ralos e atrás de eletrodomésticos.",
    "onde_nao_usar": "Evitar superfícies lavadas diariamente com água sanitária para não remover o residual.",
    "seguranca": {
      "pets": "Aguardar secagem da superfície (1h).",
      "chuva": "Ambientes secos e cobertos.",
      "horario": "Ao entardecer.",
      "epi": "Gatilho ergonômico seguro."
    },
    "alvos": [
      "baratas",
      "formigas",
      "mosquitos",
      "moscas",
      "aranhas",
      "escorpioes",
      "pragas domesticas",
      "com atrativo"
    ],
    "descricao": "Spray pronto uso de fácil aplicação com atrativo. Residual de até 6 meses contra pragas urbanas.",
    "caracteristicas": [
      "Residual de até 6 meses",
      "Com atrativo especial",
      "Não precisa atingir o inseto",
      "Frascos de 40ml e 120ml"
    ],
    "imagens": [
      "img/produtos/p14-fimo-combina-spray.webp"
    ],
    "unidade": "frasco",
    "referencia": "FIMO-40-120",
    "rendimento": "Residual ativo por até 6 meses por aplicação.",
    "destaque": false,
    "preco_base": 36
  },
  {
    "id": 15,
    "nome": "Pankada Multi-Insetos (30ml, 60ml, 250ml)",
    "categoria": "inseticidas",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Agente desalojante de alta potência (residual 180 dias)",
    "para_que_serve": "Poderoso inseticida concentrado de tripla ação (desalojante, choque e residual) para infestações severas de múltiplos insetos e ácaros.",
    "como_age": "Expulsa os insetos dos esconderijos mais profundos e provoca mortalidade imediata com residual ativo por até 180 dias.",
    "como_usar": "Diluir em água limpa (baixa dosagem) e pulverizar nos pontos críticos de infestação.",
    "onde_nao_usar": "Não aplicar próximo a aquários e tanques de peixes (tóxico para organismos aquáticos).",
    "seguranca": {
      "pets": "Reentrada após 2 a 3 horas de ambiente ventilado.",
      "chuva": "Resiste a intempéries em áreas externas após secar.",
      "horario": "Fim de tarde.",
      "epi": "Luvas, máscara e óculos de proteção."
    },
    "alvos": [
      "acaros",
      "barata germanica",
      "baratinha",
      "bicudo",
      "cascudinho",
      "mosca branca",
      "larva mineradora",
      "pulgoes",
      "trips",
      "desalojante"
    ],
    "descricao": "Inseticida desalojante de alta performance e baixa dosagem. Residual de até 180 dias contra múltiplos insetos.",
    "caracteristicas": [
      "Poderoso agente desalojante",
      "Residual de até 180 dias",
      "Baixa dosagem e alta eficiência",
      "Frascos 30ml, 60ml e 250ml"
    ],
    "imagens": [
      "img/produtos/p15-pankada-multi-insetos.webp"
    ],
    "unidade": "frasco",
    "referencia": "PANK-30-60-250",
    "rendimento": "Altíssima concentração com diluição super econômica.",
    "destaque": true,
    "preco_base": 34
  },
  {
    "id": 16,
    "nome": "UNIX Repik (30ml)",
    "categoria": "inseticidas",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Fipronil + Lambda para controle definitivo de cupins",
    "para_que_serve": "Combinação técnica de Fipronil + Lambda-Cialotrina para erradicação de cupins de madeira seca, cupins de solo, baratas e formigas.",
    "como_age": "Ação de transferência: os cupins e formigas contaminados levam o veneno para o ninho subterrâneo ou madeiramento, eliminando a colônia inteira.",
    "como_usar": "Diluir e injetar nos orifícios de madeira atacada ou pulverizar em barreiras químicas no solo.",
    "onde_nao_usar": "Não aplicar sobre madeiras com acabamento em verniz fresco sem teste prévio.",
    "seguranca": {
      "pets": "Isolar o local por 2 horas durante a secagem.",
      "chuva": "Em solo, aplicar com tempo firme.",
      "horario": "Qualquer horário.",
      "epi": "Luvas de borracha e máscara protetora."
    },
    "alvos": [
      "cupins de madeira",
      "cupins subterraneos",
      "baratas",
      "formigas",
      "fipronil",
      "lambda cialotrina"
    ],
    "descricao": "Associação de Fipronil + Lambda-Cialotrina para controle eficiente de baratas, cupins e formigas.",
    "caracteristicas": [
      "Fipronil + Lambda Cialotrina",
      "Eficaz contra Cupins e Baratas",
      "Frasco 30ml (Display c/ 30 frascos)"
    ],
    "imagens": [
      "img/produtos/p16-unix-repik-30ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "UNIX-REP-30",
    "rendimento": "Trata dezenas de metros lineares de barreira ou furos.",
    "destaque": false,
    "preco_base": 29
  },
  {
    "id": 17,
    "nome": "ArranKa SPM Saúde (Sachês 10g)",
    "categoria": "inseticidas",
    "tipo_formulacao": "po",
    "o_que_faz": "Sachê 100% hidrossolúvel com desalojante de pragas",
    "para_que_serve": "Inseticida em sachê que se dissolve sozinho dentro do pulverizador sem soltar pó no ar, garantindo segurança e limpeza na aplicação.",
    "como_age": "Ação rápida com agente desalojante e umectante contra aranhas, escorpiões, baratas e formigas lava-pés.",
    "como_usar": "Jogue o sachê fechado diretamente no tanque com água. Ele se dissolve em menos de 1 minuto.",
    "onde_nao_usar": "Não romper o saquinho com as mãos úmidas.",
    "seguranca": {
      "pets": "Aguardar 2h de secagem.",
      "chuva": "Resistente após secar na parede.",
      "horario": "Ao entardecer.",
      "epi": "Prático e sem contato com o pó químico."
    },
    "alvos": [
      "aranhas",
      "baratas",
      "formiga lava-pes",
      "tracas",
      "escorpioes",
      "sache hidrossoluvel",
      "desalojante"
    ],
    "descricao": "Sachê hidrossolúvel com umectante e desalojante para aranhas, baratas, formigas lava-pés e traças.",
    "caracteristicas": [
      "100% Hidrossolúvel",
      "Com umectante e desalojante",
      "Envelopes 3x10g e Caixa 1kg"
    ],
    "imagens": [
      "img/produtos/p17-arranka-spm-saude.webp"
    ],
    "unidade": "envelope",
    "referencia": "ARR-SPM-10",
    "rendimento": "Envelope com 3 sachês de 10g para até 3 pulverizadores.",
    "destaque": false,
    "preco_base": 18
  },
  {
    "id": 18,
    "nome": "ArranKa PM (Lambda-Cialotrina 10%)",
    "categoria": "inseticidas",
    "tipo_formulacao": "po",
    "o_que_faz": "Lambda 10% de alto rendimento para formigas e aranhas",
    "para_que_serve": "Pó molhável com 10% de Lambda-Cialotrina pura para controle de formiga lava-pés, aranhas, lagartas e pulgões.",
    "como_age": "Poderoso efeito de choque e desalojamento, paralisando as pragas rapidamente com efeito residual prolongado.",
    "como_usar": "Dissolver o sachê na calda de pulverização e aplicar nos ninhos e passagens.",
    "onde_nao_usar": "Não aplicar próximo a alimentos e utensílios.",
    "seguranca": {
      "pets": "Reentrada após 2 horas.",
      "chuva": "Aplicar em tempo estável.",
      "horario": "Fim de tarde.",
      "epi": "Luvas e máscara de proteção."
    },
    "alvos": [
      "formiga lava-pes",
      "pulgoes",
      "aranhas",
      "lagartas",
      "lambda-cialotrina",
      "po soluvel",
      "desalojante"
    ],
    "descricao": "Pó solúvel hidrossolúvel de alto rendimento para controle de formiga lava-pés, pulgões e aranhas.",
    "caracteristicas": [
      "Lambda-Cialotrina 10%",
      "Sachê hidrossolúvel prático",
      "Envelope 2x10g"
    ],
    "imagens": [
      "img/produtos/p18-arranka-pm-lambda.webp"
    ],
    "unidade": "envelope",
    "referencia": "ARR-PM-10",
    "rendimento": "Envelope com 2 sachês de 10g.",
    "destaque": false,
    "preco_base": 22
  },
  {
    "id": 19,
    "nome": "NaMosca GB (Sachê 20g)",
    "categoria": "mosquicidas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "Isca granulada com atrativo sexual (elimina ovos e larvas)",
    "para_que_serve": "Isca mosquicida granulada com Thiametoxam e potente feromônio sexual que atrai moscas domésticas e de estábulos a metros de distância.",
    "como_age": "As moscas consomem os grânulos e morrem em poucos minutos. Quebra o ciclo reprodutivo eliminando adultos e larvas.",
    "como_usar": "Dispor os grânulos em pratinhos plásticos ou umedecer levemente com água para reativar o atrativo por semanas.",
    "onde_nao_usar": "Não jogar no chão aberto onde animais possam lamber diretamente.",
    "seguranca": {
      "pets": "Colocar em locais altos ou pratos protegidos de cães e gatos.",
      "chuva": "Manter em áreas cobertas ou bandejas.",
      "horario": "Manhã ou tarde.",
      "epi": "Venda livre (usar luva para dispor a isca)."
    },
    "alvos": [
      "mosca domestica",
      "moscas de estabulo",
      "mosca de esterqueira",
      "larvas de mosca",
      "atrativo sexual",
      "composteira"
    ],
    "descricao": "Mosquicida completo granulado com Thiametoxam 1% e atrativo sexual. Elimina adultos, pupas e larvas.",
    "caracteristicas": [
      "Com atrativo sexual",
      "Elimina adultos, pupas e larvas",
      "Uso em esterqueiras e composteiras",
      "Sachê 20g (Display c/ 30)"
    ],
    "imagens": [
      "img/produtos/p19-namosca-gb-20g.webp"
    ],
    "unidade": "sachê",
    "referencia": "NAMOSCA-20",
    "rendimento": "Sachê de 20g atrai e elimina milhares de moscas.",
    "destaque": true,
    "preco_base": 15
  },
  {
    "id": 20,
    "nome": "BleKalt 25 (Thiamethoxam - 90g e 1kg)",
    "categoria": "mosquicidas",
    "tipo_formulacao": "po",
    "o_que_faz": "Mosquicida profissional para granjas, estábulos e laticínios",
    "para_que_serve": "O mosquicida de padrão profissional para granjas avícolas, confinamentos de gado, estábulos, frigoríficos e depósitos.",
    "como_age": "Age em todas as fases da mosca (ovo, larva, pupa e adulto). Pode ser aplicado por pulverização, pincelamento em paredes ou embebido em barbantes suspensos.",
    "como_usar": "Dissolver em água e pintar faixas em vigas ou pulverizar nas paredes dos galpões.",
    "onde_nao_usar": "Não aplicar sobre cochos de alimentação direta dos animais.",
    "seguranca": {
      "pets": "Aplicar nas partes altas fora do alcance do gado/aves.",
      "chuva": "Uso em galpões e instalações cobertas.",
      "horario": "Início da manhã.",
      "epi": "EPI completo para aplicadores profissionais."
    },
    "alvos": [
      "moscas",
      "granjas",
      "laticinios",
      "frigorificos",
      "ovos de mosca",
      "larvas",
      "pupas",
      "mosca de chifre"
    ],
    "descricao": "Inseticida mosquicida profissional para granjas, laticínios e frigoríficos. Quebra o ciclo de desenvolvimento.",
    "caracteristicas": [
      "Uso profissional em granjas e laticínios",
      "Pulverização, pincel ou barbante",
      "Elimina ovo, larva, pupa e adulto",
      "Frasco 90g e Sachê 1kg"
    ],
    "imagens": [
      "img/produtos/p20-blekalt-25.webp"
    ],
    "unidade": "un",
    "referencia": "BLEK-90-1KG",
    "rendimento": "Trata galpões inteiros de granjas e confinamentos.",
    "destaque": true,
    "preco_base": 68
  },
  {
    "id": 21,
    "nome": "Koral Moscas (60ml)",
    "categoria": "mosquicidas",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Inseticida sem cheiro para padarias, restaurantes e cozinhas",
    "para_que_serve": "Desenvolvido especificamente para controle de moscas em estabelecimentos comerciais de alimentação, cozinhas industriais e residências.",
    "como_age": "Não tem cheiro, não mancha paredes e possui efeito residual prolongado em superfícies de pouso.",
    "como_usar": "Diluir em água e pulverizar nas superfícies onde as moscas costumam pousar (beirais, azulejos, lixeiras).",
    "onde_nao_usar": "Não pulverizar sobre bancadas de corte de alimentos ou panelas.",
    "seguranca": {
      "pets": "Reentrada após 1 hora de secagem.",
      "chuva": "Ambientes internos e varandas.",
      "horario": "Fora do horário de manipulação de alimentos.",
      "epi": "Luvas de borracha."
    },
    "alvos": [
      "mosca domestica",
      "moscas em padarias",
      "restaurantes",
      "cozinhas",
      "acougues",
      "sem cheiro",
      "nao mancha"
    ],
    "descricao": "Inseticida para combate a moscas em residências, restaurantes e padarias. Sem cheiro e sem manchas.",
    "caracteristicas": [
      "Ideal para restaurantes e padarias",
      "Não mancha e não tem cheiro",
      "Longo período residual",
      "Frasco 60ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p21-koral-moscas-60ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KORAL-MOSC-60",
    "rendimento": "Frasco de 60ml rende até 20 a 30 litros de calda.",
    "destaque": false,
    "preco_base": 39
  },
  {
    "id": 22,
    "nome": "Mata-Formiga Gel Indoxacarbe (Seringa 10g)",
    "categoria": "formicidas-baratas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "Efeito Dominó: elimina formigueiro e rainha em 72h",
    "para_que_serve": "Gel atrativo profissional para formigas doceiras, formigas-fantasma e formigas caseiras que invadem cozinhas e computadores.",
    "como_age": "Efeito Dominó: as operárias comem o gel, voltam para o ninho e alimentam a rainha e as crias. Todo o formigueiro morre em até 72 horas.",
    "como_usar": "Aplicar pequenos filetes (gotas de 1 a 2cm) próximo às trilhas e frestas onde as formigas passam.",
    "onde_nao_usar": "NUNCA passe inseticida spray em cima do gel, pois isso afasta as formigas e estraga a isca.",
    "seguranca": {
      "pets": "Aplicar em cantos e frestas fora do alcance direto de animais.",
      "chuva": "Manter em locais secos e protegidos.",
      "horario": "Qualquer hora do dia.",
      "epi": "Seringa aplicadora limpa sem contato manual."
    },
    "alvos": [
      "formigas doceiras",
      "formiga fantasma",
      "formiga louca",
      "ninho de formiga",
      "rainha",
      "efeito domino",
      "formiga em cozinha"
    ],
    "descricao": "Gel formicida de alta atratividade com efeito dominó: elimina toda a colônia e formigueiro em até 72h.",
    "caracteristicas": [
      "Efeito dominó (elimina rainha)",
      "Ação em até 72h",
      "Fácil aplicação em frestas",
      "Seringa 10g (Caixa c/ 80 seringas)"
    ],
    "imagens": [
      "img/produtos/p22-mata-formiga-gel-10g.webp"
    ],
    "unidade": "seringa",
    "referencia": "GEL-FORM-10G",
    "rendimento": "Seringa de 10g trata dezenas de cômodos e ninhos.",
    "destaque": true,
    "preco_base": 25
  },
  {
    "id": 23,
    "nome": "Mata-Barata Gel Imidacloprid (Seringa 10g)",
    "categoria": "formicidas-baratas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "Efeito Cascata: atrai e extermina ninhos de baratas",
    "para_que_serve": "O gel baraticida definitivo contra baratinhas de cozinha (Blattella germanica) e baratas grandes de esgoto (Periplaneta americana).",
    "como_age": "Efeito Cascata: as baratas comem o gel, retornam ao ninho escuro e contaminam toda a população pelas fezes e contato social.",
    "como_usar": "Aplicar pequenas gotas embaixo de pias, atrás de geladeiras, dobradiças de armários e motores de eletrodomésticos.",
    "onde_nao_usar": "Não aplicar em locais lavados diariamente com cloro ou detergente.",
    "seguranca": {
      "pets": "Aplicar em frestas profundas e cantos inacessíveis a pets.",
      "chuva": "Uso em ambientes internos protegidos.",
      "horario": "Ao entardecer (pico de atividade das baratas).",
      "epi": "Seringa dosadora sem contato manual."
    },
    "alvos": [
      "baratas de esgoto",
      "periplaneta",
      "baratinhas de cozinha",
      "blattella germanica",
      "ninho de baratas",
      "efeito cascata"
    ],
    "descricao": "Gel baraticida com Imidacloprid de alta atratividade e efeito dominó para eliminação completa de ninhos.",
    "caracteristicas": [
      "Eficaz contra todas as baratas",
      "Efeito dominó comprovado",
      "Não mancha e não tem cheiro",
      "Seringa 10g (Caixa c/ 80 seringas)"
    ],
    "imagens": [
      "img/produtos/p23-mata-barata-gel-10g.webp"
    ],
    "unidade": "seringa",
    "referencia": "GEL-BAR-10G",
    "rendimento": "Seringa de 10g trata até 40m² de frestas e cozinhas.",
    "destaque": true,
    "preco_base": 25
  },
  {
    "id": 24,
    "nome": "Mata-Formiga Isca Granulada Etiprole (50g)",
    "categoria": "formicidas-baratas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "1ª com Etiprole: corte de Saúvas e Quen-Quéns",
    "para_que_serve": "A 1ª isca granulada do mercado nacional formulada com Etiprole, específica para corte e extermínio de formigas cortadeiras Saúvas e Quen-Quéns.",
    "como_age": "As operárias carregam os grânulos para dentro do formigueiro. O princípio ativo extermina o fungo alimentar e a rainha em poucos dias.",
    "como_usar": "Despejar a isca ao lado dos carreiros ou olheiros ativos (nunca dentro do buraco para não assustar as formigas).",
    "onde_nao_usar": "Não aplicar em dias de chuva ou solo molhado (os grânulos perdem a atratividade se umedecerem antes de serem carregados).",
    "seguranca": {
      "pets": "Aplicar fora de áreas de pisoteio de animais.",
      "chuva": "Obrigatório aplicar em tempo seco.",
      "horario": "Fim de tarde (quando as cortadeiras saem para o corte).",
      "epi": "Aplicar direto do sachê sem tocar com as mãos."
    },
    "alvos": [
      "formigas cortadeiras",
      "sauvas",
      "quen-quem",
      "cortadeiras de folhas",
      "pastagens",
      "jardins",
      "pomares",
      "etiprole"
    ],
    "descricao": "1ª isca formicida do mercado com Etiprole. Alta eficiência e baixa dosagem contra formigas Quen-Quém e Saúvas.",
    "caracteristicas": [
      "1ª Isca com Etiprole do Brasil",
      "Eficaz para Saúvas e Quen-Quéns",
      "Maior rendimento e atratividade",
      "Sachê 50g (Pacote c/ 10 sachês)"
    ],
    "imagens": [
      "img/produtos/p24-mata-formiga-isca-50g.webp"
    ],
    "unidade": "sachê",
    "referencia": "ISCA-ETIP-50",
    "rendimento": "Sachê de 50g elimina ninhos médios de formigueiros.",
    "destaque": true,
    "preco_base": 16
  },
  {
    "id": 25,
    "nome": "K-Rato Soft-Bait Isca Macia (150g e 2kg)",
    "categoria": "raticidas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "Isca macia com gordura de queijo para ratos e ratazanas",
    "para_que_serve": "Isca raticida de altíssima palatabilidade com gordura de queijo, irresistível mesmo onde há abundância de outros alimentos (galpões de grãos, lanchonetes).",
    "como_age": "Anticoagulante de dose única: o roedor consome a isca e morre em 3 a 5 dias longe do local. O animal desseca sem exalar mau cheiro.",
    "como_usar": "Fixar os sachês macios dentro de caixas porta-iscas ao longo de rodapés, forros e trilhas de roedores.",
    "onde_nao_usar": "Não espalhar a isca solta no chão sem proteção.",
    "seguranca": {
      "pets": "OBRIGATÓRIO uso de caixas porta-iscas com chave para proteção de cães e gatos.",
      "chuva": "Resistente à umidade natural.",
      "horario": "Ao entardecer.",
      "epi": "Manusear sempre com luvas para não deixar cheiro humano."
    },
    "alvos": [
      "ratos",
      "camundongos",
      "ratazanas",
      "roedores",
      "gordura de queijo",
      "isca macia",
      "galpoes",
      "fazendas",
      "depositos"
    ],
    "descricao": "Isca raticida macia com gordura de queijo de alta atratividade. Elimina ratos, camundongos e ratazanas.",
    "caracteristicas": [
      "Único com gordura de queijo",
      "Elimina ratos e ratazanas",
      "Isca macia de alta palatabilidade",
      "Sachê 150g e Balde 2kg"
    ],
    "imagens": [
      "img/produtos/p25-k-rato-soft-bait.webp"
    ],
    "unidade": "un",
    "referencia": "KRATO-SOFT-150-2K",
    "rendimento": "Sachê de 150g ou Balde de 2kg para grandes infestações.",
    "destaque": true,
    "preco_base": 32
  },
  {
    "id": 26,
    "nome": "K-Rato Raticida Pó de Contato (100g, 250g, 1kg)",
    "categoria": "raticidas",
    "tipo_formulacao": "po",
    "o_que_faz": "Pó aderente aos pelos: contamina a colônia e o roedor seca",
    "para_que_serve": "Raticida em pó ultrafino aderente para locais onde os roedores não aceitam iscas alimentares (forros, tocas e canaletas).",
    "como_age": "O pó gruda nas patas e pelos do rato. Ao se lamber no ninho para se limpar, ele e os filhotes ingerem o produto e morrem dessecos.",
    "como_usar": "Polvilhar faixas de 5 a 10cm nas tocas, forros e cantos de passagem com polvilhadeira.",
    "onde_nao_usar": "Não aplicar onde possa entrar em contato com alimentos ou água.",
    "seguranca": {
      "pets": "Aplicar exclusivamente em tocas e forros inacessíveis a animais.",
      "chuva": "Manter em locais secos.",
      "horario": "Ao entardecer.",
      "epi": "Luvas e máscara contra pó."
    },
    "alvos": [
      "ratos",
      "ratazanas",
      "camundongos",
      "colonia de roedores",
      "po de contato",
      "ninhos",
      "roedor seca"
    ],
    "descricao": "Pó fino aderente de contato para controle de colônias de roedores. Roedor seca totalmente após a morte.",
    "caracteristicas": [
      "Aderente aos pelos dos roedores",
      "Contamina toda a colônia",
      "Roedor seca após a morte",
      "Frascos 100g, 250g e 1kg"
    ],
    "imagens": [
      "img/produtos/p26-k-rato-po-contato.webp"
    ],
    "unidade": "frasco",
    "referencia": "KRATO-PO-100-250-1K",
    "rendimento": "Frascos de 100g, 250g e 1kg com alto rendimento.",
    "destaque": false,
    "preco_base": 26
  },
  {
    "id": 27,
    "nome": "Karamujo Garden (Sachê 30g)",
    "categoria": "lesmicidas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "1ª isca para jardim amador resistente à umidade com Bórax",
    "para_que_serve": "A 1ª isca lesmicida registrada para jardinagem amadora e hortas caseiras no Brasil. Elimina caramujos de jardim e lesmas sem estragar as plantas.",
    "como_age": "Contém Bórax e atrativo resistente à chuva. As lesmas e caramujos são atraídos, ingerem a isca e morrem dessecos rapidamente.",
    "como_usar": "Espalhar os grânulos sobre o solo úmido ao redor dos canteiros, vasos e plantas atacadas.",
    "onde_nao_usar": "Não colocar em montes concentrados; espalhe de forma homogênea.",
    "seguranca": {
      "pets": "Manter cães longe da área durante a aplicação.",
      "chuva": "Resistente à umidade e regas do jardim.",
      "horario": "Ao entardecer ou após regar a horta.",
      "epi": "Venda livre (usar luvas na distribuição)."
    },
    "alvos": [
      "caramujos",
      "lesmas",
      "caramujo de jardim",
      "hortas",
      "jardinagem amadora",
      "borax",
      "resistente a chuva"
    ],
    "descricao": "Isca lesmicida registrada para uso em jardinagem amadora. Resistente à umidade e único com Borax.",
    "caracteristicas": [
      "Registrado p/ Jardinagem Amadora",
      "Resistente à umidade e chuva",
      "Único com Borax",
      "Display c/ 30 sachês de 30g"
    ],
    "imagens": [
      "img/produtos/p27-karamujo-garden-30g.webp"
    ],
    "unidade": "sachê",
    "referencia": "KARM-GARD-30",
    "rendimento": "Sachê de 30g cobre canteiros residenciais.",
    "destaque": true,
    "preco_base": 14
  },
  {
    "id": 28,
    "nome": "Karamujo Metaldeído Pellets (200g e 1kg)",
    "categoria": "lesmicidas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "Pellets de alta durabilidade para Caramujo Africano",
    "para_que_serve": "Formulação profissional em pellets para combate a grandes infestações de Caramujo Africano e lesmas gigantes em chácaras, fazendas e terrenos.",
    "como_age": "Pellets de alta resistência às intempéries com Metaldeído puro e Bórax, garantindo semanas de atratividade ativa no solo.",
    "como_usar": "Distribuir uniformemente no solo nas áreas de refúgio dos caramujos (muros, sombras e folhagens densas).",
    "onde_nao_usar": "Não acumular pilhas da isca.",
    "seguranca": {
      "pets": "Manter animais de grande porte longe da área tratada.",
      "chuva": "Pellets de altíssima durabilidade contra chuvas.",
      "horario": "Ao entardecer.",
      "epi": "Luvas de proteção."
    },
    "alvos": [
      "caramujo africano",
      "lesmas gigantes",
      "grandes infestacoes",
      "chacaras",
      "fazendas",
      "metaldeido pellets"
    ],
    "descricao": "Pellets de alta tecnologia para controle de Caramujo Africano e lesmas em grandes ambientes.",
    "caracteristicas": [
      "Específico para Caramujo Africano",
      "Pellets de alta durabilidade",
      "Resistente a intempéries",
      "Sachês 200g e 1kg"
    ],
    "imagens": [
      "img/produtos/p28-karamujo-metaldeido-pellets.webp",
      "img/produtos/p28-karamujo-metaldeido-pellets1.webp",
      "img/produtos/p28-karamujo-metaldeido-pellets2.webp"
    ],
    "unidade": "sachê",
    "referencia": "KARM-MET-200-1K",
    "rendimento": "Sachês de 200g e 1kg para grandes áreas.",
    "destaque": false,
    "preco_base": 38
  },
  {
    "id": 29,
    "nome": "Koral Carrapatos e Pulgas (60ml)",
    "categoria": "carrapatos-pulgas",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Ovicida e Larvicida: diluição de 3ml/L para canis e pátios",
    "para_que_serve": "Inseticida concentrado de alto rendimento para controle de carrapatos, pulgas e ácaros em canis, pátios, muros e calçadas.",
    "como_age": "Quebra o ciclo de reprodução: atua como ovicida (destrói os ovos) e larvicida (mata as larvas e adultos), impedindo novas gerações.",
    "como_usar": "Diluir apenas 3ml por litro de água e pulverizar em todo o piso, frestas de casinhas e rodapés.",
    "onde_nao_usar": "NUNCA banhar ou aplicar diretamente sobre o corpo do animal.",
    "seguranca": {
      "pets": "Retirar os animais do canil durante a aplicação e retornar somente após a secagem completa do piso (2 horas).",
      "chuva": "Aplicar em tempo firme.",
      "horario": "Fim de tarde.",
      "epi": "Luvas e máscara de proteção."
    },
    "alvos": [
      "carrapatos",
      "pulgas",
      "canis",
      "patios",
      "larvas de pulga",
      "ovos de carrapato",
      "ovicida",
      "larvicida"
    ],
    "descricao": "Inseticida ovicida e larvicida de alta eficiência e baixa dosagem para controle em pátios e residências.",
    "caracteristicas": [
      "Ovicida e Larvicida",
      "Diluição de apenas 3ml/Litro",
      "Quebra o ciclo de reprodução",
      "Frasco 60ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p29-koral-carrapatos-pulgas-60ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KOR-CARR-60",
    "rendimento": "Frasco de 60ml rende 20 litros de calda (limpeza de grandes pátios).",
    "destaque": true,
    "preco_base": 44
  },
  {
    "id": 30,
    "nome": "Koral Pronto Uso Spray (240ml)",
    "categoria": "carrapatos-pulgas",
    "tipo_formulacao": "pronto-uso",
    "o_que_faz": "Spray pronto para caminhas de pets, canis e rodapés",
    "para_que_serve": "Solução pronta em gatilho pulverizador para higienização e desinfestação rápida de casinhas de pets, caminhas e rodapés.",
    "como_age": "Ação ovicida e larvicida imediata sem necessidade de diluir em baldes ou pulverizadores costais.",
    "como_usar": "Retire o pet, borrife nas frestas da casinha, piso e caminhas e espere secar.",
    "onde_nao_usar": "Não aplicar sobre a pele ou pelo do animal.",
    "seguranca": {
      "pets": "Retornar o animal para a casinha após secagem completa (1h).",
      "chuva": "Uso em ambientes cobertos.",
      "horario": "Qualquer horário.",
      "epi": "Gatilho ergonômico seguro."
    },
    "alvos": [
      "carrapatos",
      "pulgas",
      "camas de pet",
      "canis",
      "pisos",
      "pronto uso spray",
      "casinhas de cachorro"
    ],
    "descricao": "Spray pronto para aplicação direta em pisos, canis e locais frequentados por animais.",
    "caracteristicas": [
      "Gatilho spray pronto para aplicar",
      "Ovicida e Larvicida",
      "Frasco 240ml (Caixa c/ 24 frascos)"
    ],
    "imagens": [
      "img/produtos/p30-koral-pronto-uso-240ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KOR-PU-240",
    "rendimento": "Frasco de 240ml com centenas de borrifadas.",
    "destaque": false,
    "preco_base": 29
  },
  {
    "id": 31,
    "nome": "Redutor de pH para Águas Duras (100ml)",
    "categoria": "adjuvantes",
    "tipo_formulacao": "adjuvante",
    "o_que_faz": "Neutraliza águas duras e carbonatos, potencializando calda",
    "para_que_serve": "Corretor e nivelador de pH essencial para preparar a água de pulverização antes de adicionar os defensivos e herbicidas.",
    "como_age": "Neutraliza cátions livres, ferro e carbonatos da água de poço/torneira, trazendo o pH para a faixa ácida ideal (4.5 a 5.5) onde os defensivos têm 100% de absorção foliar.",
    "como_usar": "Adicionar 1ml a 2ml por litro de água no pulverizador ANTES de colocar o herbicida ou fungicida.",
    "onde_nao_usar": "Não utilizar puro.",
    "seguranca": {
      "pets": "Sem período de carência.",
      "chuva": "Potencializa a fixação dos produtos.",
      "horario": "No momento do preparo da calda.",
      "epi": "Frasco com dosador integrado de segurança."
    },
    "alvos": [
      "correcao de agua dura",
      "regulador de ph",
      "calda de pulverizacao",
      "potencializador",
      "carbonatos",
      "cations livres"
    ],
    "descricao": "Nivelador e corretor de pH para águas duras. Neutraliza carbonatos e cátions livres na calda de aplicação.",
    "caracteristicas": [
      "Corrige dureza da água",
      "Neutraliza cátions e carbonatos",
      "Potencializa defensivos",
      "Frasco 100ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p31-redutor-de-ph-100ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "RED-PH-100",
    "rendimento": "Frasco de 100ml trata de 50 a 100 litros de água.",
    "destaque": false,
    "preco_base": 22
  },
  {
    "id": 32,
    "nome": "Óleo Mineral Parafinado (100ml)",
    "categoria": "adjuvantes",
    "tipo_formulacao": "adjuvante",
    "o_que_faz": "Adjuvante e fixador: reduz evaporação e fixa calda na folha",
    "para_que_serve": "Adjuvante e espalhante adesivo de alta pureza para misturar junto com herbicidas (Kapina, Roçada, Katana) e inseticidas.",
    "como_age": "Quebra a tensão superficial da gota de água, espalha o defensivo por toda a folha, impede a evaporação rápida pelo sol e evita a lavagem por chuvas leves.",
    "como_usar": "Adicionar 1ml por litro de calda de pulverização junto com o produto principal.",
    "onde_nao_usar": "Não exceder a dosagem recomendada.",
    "seguranca": {
      "pets": "Produto atóxico como adjuvante.",
      "chuva": "Aumenta consideravelmente a resistência à chuva da aplicação.",
      "horario": "Junto com a pulverização do produto.",
      "epi": "Frasco dosador prático."
    },
    "alvos": [
      "aderencia",
      "fixador de calda",
      "anti-evaporante",
      "adjuvante",
      "emulsificante",
      "gotas de pulverizacao"
    ],
    "descricao": "Adjuvante, emulsificante, fixador e potencializador de caldas de pulverização para múltiplas funções.",
    "caracteristicas": [
      "Adjuvante e Fixador",
      "Reduz evaporação da gota",
      "Dosagem econômica: 1ml/Litro",
      "Frasco 100ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p32-oleo-mineral-parafinado-100ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "OLEO-MIN-100",
    "rendimento": "Frasco de 100ml prepara até 100 litros de calda.",
    "destaque": true,
    "preco_base": 24
  }
];