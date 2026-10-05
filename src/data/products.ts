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
    "rendimento": "Rende até 600 m² de calda de pulverização.",
    "destaque": true,
    "preco_base": 72.87,
    "manual_aplicacao": {
      "resumo_aplicador": "Desinfestante seletivo sistêmico exclusivo para Grama Esmeralda. Mata folhas largas e tiriricas pela raiz sem queimar o gramado quando aplicado no mato jovem e com solo úmido.",
      "checklist_previo": [
        "Confirme o tipo de grama: Deve ser exclusivamente Grama Esmeralda (Zoysia japonica). NUNCA aplique em Grama Batatais, São Carlos ou Santo Agostinho.",
        "Verifique o tamanho do mato: Máxima eficácia em plantas daninhas jovens de até 6 folhas ou até 10 cm de altura.",
        "Não roçar antes ou depois: Não corte a grama 3 dias antes da aplicação (para ter folha para absorver) e espere 3 dias após aplicar para roçar.",
        "Condição climática: Não aplicar sob sol a pino ou vento forte. Solo deve estar ligeiramente úmido (molhado no dia anterior)."
      ],
      "equipamentos": [
        "Pulverizador costal ou manual limpo (sem resíduos de mata-mato total)",
        "Bico leque (jato plano) para pulverização uniforme",
        "EPIs básicos: Luvas de látex/nitrílica, máscara de proteção e botas fechadas",
        "Copo medidor ou seringa dosadora para dosar os mililitros"
      ],
      "dosagem": {
        "pequena_area": {
          "titulo": "Pulverizador Manual (2 a 5 Litros)",
          "dose": "3 a 5 ml por litro de água",
          "cobertura": "1 litro de calda cobre de 25 a 30 m² de infestação pontual"
        },
        "area_total": {
          "titulo": "Tanque Costal (Frasco Todo 60ml)",
          "dose": "60ml em 15 a 20 litros de água",
          "cobertura": "Trata de 250 a 300 m² de gramado infestado"
        },
        "instrucao_diluicao": "Coloque primeiro metade da água limpa no tanque, adicione a dose de Kapina Plus, agite vigorosamente até homogeneizar e complete com o restante da água."
      },
      "passos": [
        {
          "passo": 1,
          "titulo": "Preparo do Gramado & Solo",
          "descricao": "Certifique-se de que a grama não foi cortada recentemente. O mato precisa de folhas expostas para absorver o produto. Se o tempo estiver muito seco, regue a área 1 dia antes da aplicação para abrir os estômatos das plantas daninhas.",
          "dica_do_aplicador": "Evite aplicar se houver previsão de chuva nas próximas 3 horas."
        },
        {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Nunca dobre a dosagem recomendada; o excesso pode queimar a folha rápido demais antes do princípio ativo chegar ao rizoma."
            },
        {
          "passo": 3,
          "titulo": "Técnica de Pulverização no Alvo",
          "descricao": "Mantenha o bico do pulverizador a 30-40 cm da folhagem. Pulverize com passada firme e constante, 'molhando as folhas sem deixar escorrer em poças'. O segredo é cobrir a folha do mato com microgotas uniformes.",
          "dica_do_aplicador": "Aplique sempre no início da manhã fresca ou preferencialmente após as 16h, quando a evaporação solar é mínima."
        },
        {
          "passo": 4,
          "titulo": "Limpeza & Descarte Consciente",
          "descricao": "Após a aplicação, faça a tríplice lavagem do pulverizador (lavar 3 vezes com água limpa). Guarde a sobra em local trancado, fresco e fora do alcance de crianças e animais domésticos.",
          "alerta": "Nunca descarte sobras de calda ou água de lavagem em ralos, rios ou canteiros de flores ornamentais."
        }
      ],
      "linha_do_tempo": [
        {
          "periodo": "2 a 3 Horas",
          "titulo": "Absorção Foliar",
          "descricao": "O produto é absorvido pelas folhas das invasoras. Após esse período, chuva não compromete o tratamento.",
          "icone": "🌧️"
        },
        {
          "periodo": "24 Horas",
          "titulo": "Reentrada Segura",
          "descricao": "A calda já secou totalmente. Crianças e pets (cães e gatos) podem circular livremente pelo gramado.",
          "icone": "🐾"
        },
        {
          "periodo": "7 a 10 Dias",
          "titulo": "Início dos Sintomas",
          "descricao": "As invasoras amarelam e paralisam o crescimento, bloqueando novos brotos.",
          "icone": "🍂"
        },
        {
          "periodo": "15 a 21 Dias",
          "titulo": "Morte Radicular Total",
          "descricao": "Dessecação completa da raiz. A grama esmeralda ocupa o espaço limpo sem falhas.",
          "icone": "🌱"
        }
      ]
    }
  },
  {
    "id": 2,
    "nome": "Kapina Tradicional (60ml)",
    "categoria": "gramados",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Mata Tiririca com raiz/batatinha sem queimar a grama",
    "para_que_serve": "O herbicida seletivo consagrado no Brasil para erradicação de Cyperáceas (Tiririca) em gramados residenciais e comerciais. Não pode ser usado em grama-amendoim (amendoim-forrageiro) ",
    "como_age": "Penetra na folhagem da tiririca e atinge os rizomas, tubérculos subterrâneos (batatinhas e cebolinhas), impedindo definitivamente a rebrota da praga.",
    "como_usar": "Diluir em água limpa conforme a dosagem recomendada e pulverizar sobre as folhas da tiririca. Manter o gramado bem irrigado nos dias seguintes para favorecer a absorção.",
    "onde_nao_usar": "Não aplicar em dias de seca extrema ou sobre gramados recém-plantados (menos de 45 dias de plantio). Não pode ser usado em grama-amendoim (amendoim-forrageiro)",
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
    "rendimento": "Rende até 600 m² de calda de pulverização.",
    "destaque": true,
    "preco_base": 50.66,
    "manual_aplicacao": {
        "resumo_aplicador": "Herbicida seletivo consagrado para erradicação definitiva de Tiriricas (Cyperáceas) em gramados de folhas estreitas. Atua dessequeando bulbos, rizomas e 'batatinhas' subterrâneas sem queimar a grama.",
        "checklist_previo": [
            "Identifique o alvo correto: Específico para Tiriricas (Cyperus rotundus / folhas estreitas brilhantes saindo de batatinhas).",
            "Gramados compatíveis: Seguro para gramados residenciais e comerciais de folhas estreitas (como Grama Esmeralda).",
            "Não roçar a tiririca antes: Deixe a folhagem da tiririca livre e crescida para captar a calda.",
            "Idade da grama: Não aplicar em gramados com menos de 45 dias de plantio ou sob seca extrema."
        ],
        "equipamentos": [
            "Pulverizador manual ou costal com bico leque",
            "Copo medidor ou dosador milimetrado",
            "Luvas impermeáveis e máscara protetora",
            "Tanque exclusivo ou higienizado"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Pulverizador Manual (2 a 5 Litros)",
                "dose": "3 a 5 ml por litro de água",
                "cobertura": "1L de calda trata de 25 a 30 m² de reboleiras de tiririca"
            },
            "area_total": {
                "titulo": "Tanque Costal (Frasco Todo 60ml)",
                "dose": "60ml em 15 a 20 litros de água",
                "cobertura": "Cobre de 250 a 300 m² de infestação contínua"
            },
            "instrucao_diluicao": "Abasteça metade do tanque com água limpa, adicione a dose indicada de Kapina Tradicional, agite bem para homogeneizar e complete com o restante da água."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Condicionamento e Umidade do Gramado",
                "descricao": "A tiririca deve estar hidratada para translocar o produto até as batatinhas. Se o solo estiver seco, irrigue bem no dia anterior à aplicação.",
                "dica_do_aplicador": "Não corte a grama nos 3 dias antes da aplicação para garantir grande área foliar de contato."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Nunca dobre a dosagem recomendada; o excesso pode queimar a folha rápido demais antes do princípio ativo chegar ao rizoma."
            },
            {
                "passo": 3,
                "titulo": "Aplicação Pontual nas Folhas da Tiririca",
                "descricao": "Pulverize mantendo passada constante e bico a 30cm das folhas. Molhe a folhagem da tiririca uniformemente sem criar poças no solo.",
                "dica_do_aplicador": "Aplique nas horas frescas do dia: início da manhã ou preferencialmente após as 16h."
            },
            {
                "passo": 4,
                "titulo": "Retomada da Irrigação e Manutenção",
                "descricao": "Aguarde no mínimo 2 a 3 horas sem chuva ou rega. Após 24 horas, retome a irrigação normal do gramado para auxiliar o fluxo de seiva e acelerar a translocação até a raiz.",
                "alerta": "Não arranque as tiriricas manualmente após a aplicação; deixe o produto agir até a morte completa da batatinha."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 a 3 Horas",
                "titulo": "Absorção Sistêmica",
                "descricao": "O defensivo penetra na cutícula foliar da tiririca e não é mais lavado por chuva.",
                "icone": "🌧️"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Reentrada de Pets",
                "descricao": "Calda completamente seca na grama. Animais e crianças podem brincar normalmente.",
                "icone": "🐾"
            },
            {
                "periodo": "7 a 10 Dias",
                "titulo": "Clorose e Paralisação",
                "descricao": "As folhas da tiririca amarelam e cessam completamente a emissão de novos brotos.",
                "icone": "🍂"
            },
            {
                "periodo": "15 a 25 Dias",
                "titulo": "Morte das Batatinhas",
                "descricao": "Dessecação e necrose dos rizomas subterrâneos, erradicando o foco reprodutivo.",
                "icone": "🌱"
            }
        ]
    }
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
    "rendimento": "Rende até 600 m² de calda de pulverização.",
    "destaque": false,
    "preco_base": 50.75,
    "manual_aplicacao": {
        "resumo_aplicador": "Desinfestante seletivo pós-emergente seguro para TODOS os tipos de gramados, eliminando 100% da Roseta (raiz e folhas espinhosas) que fura pés e patas.",
        "checklist_previo": [
            "Segurança total de espécie: Seguro para Grama Esmeralda, São Carlos, Batatais, Bermuda e Santo Agostinho.",
            "Identificação do alvo: Específico para Roseta (Soliva pterosperma / espinho rasteiro que incomoda pessoas e animais).",
            "Momento ideal: Aplicar logo que notar os focos de roseta, preferencialmente antes do endurecimento dos espinhos maduros.",
            "Solo úmido: Terreno ligeiramente úmido acelera a ação radicular."
        ],
        "equipamentos": [
            "Pulverizador costal ou manual com bico leque",
            "Luvas de proteção impermeáveis",
            "Dosador graduado",
            "Calçado fechado e calça comprida"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Pulverizador Manual (2 a 5 Litros)",
                "dose": "3 a 5 ml por litro de água",
                "cobertura": "1L de calda trata cerca de 25 a 30 m² de rosetas"
            },
            "area_total": {
                "titulo": "Tanque Costal (Frasco Todo 60ml)",
                "dose": "60ml em 15 a 20 litros de água",
                "cobertura": "Trata até 300 m² de gramado infestado"
            },
            "instrucao_diluicao": "Agite o frasco de Korsário. Em meio tanque de água, adicione a dose, agite bem e complete o reservatório."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Mapeamento das Manchas de Roseta",
                "descricao": "Inspecione o gramado e localize as áreas onde a roseta está alastrada, especialmente áreas mais pisoteadas e com terra compactada.",
                "dica_do_aplicador": "Aplicar com solo úmido (após orvalho da manhã ou rega prévia no dia anterior)."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Evite dias de vento forte para não desviar a calda para canteiros de flores sensíveis."
            },
            {
                "passo": 3,
                "titulo": "Pulverização de Cobertura",
                "descricao": "Passe o bico leque cobrindo toda a folhagem da roseta. O produto age por absorção dupla: foliar e radicular.",
                "dica_do_aplicador": "Como o Korsário é seguro para todos os gramados, você pode aplicar em área total sem medo de manchar o gramado."
            },
            {
                "passo": 4,
                "titulo": "Secagem e Limpeza",
                "descricao": "Lave o pulverizador com água corrente logo após o término. Aguarde o período de carência para irrigar.",
                "alerta": "Mantenha crianças e pets fora da área durante a pulverização até secar."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 Horas",
                "titulo": "Absorção Dupla",
                "descricao": "Fixação nas folhas e sistema vascular da roseta.",
                "icone": "🌧️"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Área Liberada",
                "descricao": "Pets e família podem circular com segurança.",
                "icone": "🐾"
            },
            {
                "periodo": "5 a 7 Dias",
                "titulo": "Murchamento",
                "descricao": "A planta perde o vigor e os espinhos começam a desidratar.",
                "icone": "🍂"
            },
            {
                "periodo": "12 a 18 Dias",
                "titulo": "Eliminação Total",
                "descricao": "100% da raiz e da parte aérea eliminadas.",
                "icone": "🌱"
            }
        ]
    }
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
    "rendimento": "Rende até 300 m² de calda de pulverização.",
    "destaque": true,
    "preco_base": 36.70,
    "manual_aplicacao": {
        "resumo_aplicador": "Herbicida seletivo inibidor da ALS para eliminar capins invasores difíceis (Pé-de-Galinha, Braquiária, Capim Colchão) em Grama Esmeralda e Bermuda.",
        "checklist_previo": [
            "Espécie de grama permitida: EXCLUSIVO para Grama Esmeralda e Grama Bermuda. NUNCA aplique em Grama Batatais ou São Carlos.",
            "HORÁRIO OBRIGATÓRIO: Aplicação OBRIGATÓRIA após as 16h00 (para evitar fitotoxicidade por calor e garantir máxima absorção).",
            "Estágio do capim invasor: Mais eficaz em capins jovens com até 4 perfilhos (antes de formar sementes duras).",
            "Não roçar nos 3 dias anteriores nem nos 4 dias posteriores."
        ],
        "equipamentos": [
            "Pulverizador costal com bico leque antideriva",
            "Seringa ou copo medidor para dosagem de 1,5 a 2ml",
            "EPI completo: Luvas impermeáveis, máscara e botas",
            "Água limpa e neutra"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Pulverizador Manual (2 a 5 Litros)",
                "dose": "1,5 a 2 ml por litro de água",
                "cobertura": "1L de calda trata cerca de 25 a 30 m² de touceiras invasoras"
            },
            "area_total": {
                "titulo": "Frasco Todo (30ml) em Tanque Costal",
                "dose": "30ml em 15 a 20 litros de água",
                "cobertura": "Trata de 200 a 300 m² de área infestada"
            },
            "instrucao_diluicao": "Agite vigorosamente o frasco de 30ml. Adicione a dose exata no tanque com metade da água, mexa bem e termine de encher."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Aguardar o Horário Correto (Após as 16h)",
                "descricao": "O Katana exige aplicação no final da tarde. O sol quente do meio-dia queima a folha antes da absorção estomática correta.",
                "alerta": "JAMAIS aplique pela manhã ou sob sol forte entre 10h e 15h."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Não faça misturas ou alterações de dosagem por conta própria."
            },
            {
                "passo": 3,
                "titulo": "Pulverização Focada nas Touceiras",
                "descricao": "Aproxime o bico a 25-30cm das touceiras de capim pé-de-galinha e braquiária. Aplique cobrindo o coração da planta invasora.",
                "dica_do_aplicador": "Em reboleiras densas, faça uma passada lenta e uniforme cobrindo bem a base."
            },
            {
                "passo": 4,
                "titulo": "Repouso e Cuidados Pós-Aplicação",
                "descricao": "Mantenha a grama sem corte por pelo menos 4 dias para que o princípio ativo caminhe até as gemas radiculares do capim invasor.",
                "alerta": "Lave o tanque imediatamente com água e sabão após o término."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 a 3 Horas",
                "titulo": "Inibição Enzimática",
                "descricao": "O princípio ativo penetra e bloqueia a síntese de aminoácidos do capim.",
                "icone": "🌧️"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Reentrada de Animais",
                "descricao": "Grama seca; seguro para circulação de cães, gatos e crianças.",
                "icone": "🐾"
            },
            {
                "periodo": "7 a 10 Dias",
                "titulo": "Amarelecimento Central",
                "descricao": "O miolo do capim invasor fica avermelhado/amarelado e trava o crescimento.",
                "icone": "🍂"
            },
            {
                "periodo": "15 a 25 Dias",
                "titulo": "Secagem Completa",
                "descricao": "As touceiras de pé-de-galinha e braquiária secam até a raiz, liberando a grama esmeralda.",
                "icone": "🌱"
            }
        ]
    }
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
    "rendimento": "Rende até 300 m² de calda de pulverização.",
    "destaque": false,
    "preco_base": 44.22,
    "manual_aplicacao": {
        "resumo_aplicador": "Fungicida sistêmico de amplo espectro para gramados e plantas ornamentais. Trata fungos de solo e aéreos, principalmente Rhizoctonia, queima foliar e podridões.",
        "checklist_previo": [
            "Identificação: Manchas circulares amareladas, bordas marrons ou mofo/queima foliar no gramado ou flores.",
            "Diagnóstico precoce: Quanto antes aplicar nas primeiras manchas, mais rápido o gramado se recupera.",
            "Momento de aplicação: De manhã fresca ou final de tarde com folhas sem orvalho excessivo.",
            "Borda de segurança: Tratar a mancha e mais 1 metro ao redor do foco."
        ],
        "equipamentos": [
            "Pulverizador costal ou de compressão prévia",
            "Bico cone ou leque de média vazão",
            "Luvas e óculos de proteção",
            "Balde dosador limpo"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Dose Padrão de Calda Concentrada",
                "dose": "100ml em 1 litro de água limpa",
                "cobertura": "Aplicar 16,67 ml da calda resultante por m² infestado"
            },
            "area_total": {
                "titulo": "Cobertura de Gramado por Frasco (100ml)",
                "dose": "100ml rende calda para até 60 m² de área tratada",
                "cobertura": "Trata 60 m² de mancha ativa e bordaduras"
            },
            "instrucao_diluicao": "Dilua 100ml de Kcura em 1 litro de água para formar a calda base concentrada. Misture bem e aplique 16,67ml dessa calda por metro quadrado."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Demarcação do Foco da Doença",
                "descricao": "Localize a mancha circular ou folhagem com necrose fúngica. Adicione 1 metro de raio além da borda visível da infecção.",
                "dica_do_aplicador": "Não passe o cortador de grama sobre a área doente antes da aplicação para não espalhar esporos pelo jardim."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Use máscara durante a manipulação para evitar inalação da névoa."
            },
            {
                "passo": 3,
                "titulo": "Pulverização de Molhamento",
                "descricao": "Pulverize diretamente sobre as folhas e na base do colo da grama/planta, molhando bem o ponto de inserção do solo.",
                "dica_do_aplicador": "Em caso de ataques severos de Rhizoctonia, repita a aplicação após 14 dias."
            },
            {
                "passo": 4,
                "titulo": "Manejo Cultural",
                "descricao": "Reduza temporariamente a frequência de regas noturnas no gramado, pois o excesso de umidade prolongada favorece fungos.",
                "alerta": "Limpe as lâminas das ferramentas após cuidar da área infectada."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 Horas",
                "titulo": "Ação Sistêmica",
                "descricao": "O fungicida entra no tecido vascular da planta e para o avanço das hifas.",
                "icone": "🌧️"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Liberação de Acesso",
                "descricao": "Área segura após secagem da calda foliar.",
                "icone": "🐾"
            },
            {
                "periodo": "3 a 5 Dias",
                "titulo": "Bloqueio do Fungo",
                "descricao": "A mancha para de crescer e as bordas estabilizam.",
                "icone": "🛑"
            },
            {
                "periodo": "10 a 20 Dias",
                "titulo": "Rebrota Saudável",
                "descricao": "Novas brotações sadias e verdes substituem o tecido atacado.",
                "icone": "🌱"
            }
        ]
    }
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
    "rendimento": "Rende até 300 m² de calda de pulverização.",
    "destaque": true,
    "preco_base": 38.20,
    "manual_aplicacao": {
        "resumo_aplicador": "Desinfestante total sistêmico não seletivo com ação pós e pré-emergente. Formulado com Óleo Mineral + Sulfato de Amônia, 100% LIVRE DE POEA, mantendo o solo limpo por até 90 dias.",
        "checklist_previo": [
            "PRODUTO NÃO SELETIVO: Mata qualquer planta que receber a calda (gramados, flores, folhagens). Use apenas onde quer limpar tudo.",
            "Destino ideal: Terrenos baldios, calçadas, muros, caminhos de pedra, aceiros e renovação total de áreas.",
            "Segurança toxicológica: 100% livre de surfactantes POEA cancerígenos.",
            "Clima: Aplicar em dia ensolarado, sem vento e sem chuva prevista nas próximas 3 horas."
        ],
        "equipamentos": [
            "Pulverizador costal com bico leque de gotas médias/grossas",
            "Chapéu protetor ou campânula plástica (se for aplicar perto de plantas úteis)",
            "Luvas de borracha, óculos de segurança e botas",
            "Água limpa e sem barro"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Pulverizador Manual (5 Litros)",
                "dose": "30 a 35 ml para 5 litros de água",
                "cobertura": "Limpa de 80 a 100 m² de mato denso"
            },
            "area_total": {
                "titulo": "Frasco Todo (100ml) em Tanque Costal",
                "dose": "100ml em 15 a 20 litros de água",
                "cobertura": "Limpa até 300 m² de terreno com mato alto ou rasteiro"
            },
            "instrucao_diluicao": "Encha o pulverizador com metade da água, adicione o frasco de Roçada (100ml), mexa bem para emulsionar o óleo mineral e complete o volume."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Inspeção e Proteção de Plantas Vizinhas",
                "descricao": "Cubra ou mantenha distância de plantas ornamentais, árvores jovens e gramados que não devam ser atingidos.",
                "alerta": "NUNCA aplique com vento; a deriva de gotículas pode matar plantas do vizinho ou do seu jardim."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Não altere a proporção de calda recomendada na bula."
            },
            {
                "passo": 3,
                "titulo": "Pulverização de Cobertura Total",
                "descricao": "Pulverize sobre toda a vegetação indesejada até molhar bem a folhagem. O efeito pré-emergente atua criando uma película no solo.",
                "dica_do_aplicador": "Aplique entre 8h e 16h em dias ensolarados com as folhas secas."
            },
            {
                "passo": 4,
                "titulo": "Período de Ação e Efeito Prolongado",
                "descricao": "Não mexa nem capine a terra após aplicar; o produto precisa circular na raiz e formar a barreira residual de 90 dias.",
                "alerta": "Tríplice lavagem obrigatória no tanque antes de usar em outras lavouras."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 Horas",
                "titulo": "Absorção Profunda",
                "descricao": "Óleo mineral fixa nas ceras das folhas e resiste a chuvas posteriores.",
                "icone": "🌧️"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Reentrada Segura",
                "descricao": "Solo seco; circulação liberada para pets e pedestres.",
                "icone": "🐾"
            },
            {
                "periodo": "3 a 7 Dias",
                "titulo": "Amarelecimento Geral",
                "descricao": "O mato perde o vigor e começa a secar de cima para baixo.",
                "icone": "🍂"
            },
            {
                "periodo": "15 a 25 Dias",
                "titulo": "Seca Total & Barreira",
                "descricao": "Mato 100% seco pela raiz e solo protegido de novas germinações por até 90 dias.",
                "icone": "🛑"
            }
        ]
    }
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
    "rendimento": "Rende até 300 m² de calda de pulverização.",
    "destaque": false,
    "preco_base": 22.75,
    "manual_aplicacao": {
        "resumo_aplicador": "Emulsão aquosa (EW) para desinfestação urbana total de calçadas, pátios, muros e terrenos. Fórmula tecnológica sem solventes pesados, 100% sem POEA e com alta penetração.",
        "checklist_previo": [
            "Produto não seletivo: Mata toda a vegetação atingida.",
            "Ideal para áreas urbanas: Calçadas, sarjetas, muros de pedra, pátios de brita e pavers.",
            "Fórmula moderna EW: Base aquosa, sem cheiro forte de solvente químico agressivo.",
            "Sem risco cancerígeno: 100% livre de POEA."
        ],
        "equipamentos": [
            "Pulverizador manual ou costal com bico leque",
            "Luvas e óculos protetores",
            "Medidor graduado",
            "Calçado fechado"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Pulverizador Manual (3 a 5 Litros)",
                "dose": "20 a 30 ml por carga",
                "cobertura": "Trata de 60 a 90 m² de calçadas e cantos de muro"
            },
            "area_total": {
                "titulo": "Frasco Todo (100ml)",
                "dose": "100ml em 15 a 20 litros de água",
                "cobertura": "Cobre até 300 m² de terreno urbano"
            },
            "instrucao_diluicao": "Adicione o ArranKa EW na água limpa, agite suavemente para dispersão da emulsão aquosa e pulverize."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Limpeza de Folhas Soltas",
                "descricao": "Varra folhas mortas e papéis que possam estar cobrindo o mato que cresce nas fendas e calçadas.",
                "dica_do_aplicador": "Aplique quando o mato estiver exposto ao sol para acelerar a ação."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Não use a mesma água para regar vasos ou hortaliças."
            },
            {
                "passo": 3,
                "titulo": "Aplicação Direcionada",
                "descricao": "Mantenha o bico bem próximo às juntas de calçadas, rejuntes de pavers e frestas de muros.",
                "dica_do_aplicador": "Molhe bem a base de onde o mato brota para atingir raízes superficiais."
            },
            {
                "passo": 4,
                "titulo": "Secagem e Cuidados",
                "descricao": "Aguarde secar por completo antes de transitar normalmente.",
                "alerta": "Não lave a calçada com mangueira nas primeiras 4 horas após a aplicação."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 Horas",
                "titulo": "Fixação e Penetração",
                "descricao": "Ação dos surfactantes e sulfato de potássio na cutícula do mato.",
                "icone": "🌧️"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Secagem Completa",
                "descricao": "Acesso normal liberado sem resíduo úmido.",
                "icone": "🐾"
            },
            {
                "periodo": "4 a 6 Dias",
                "titulo": "Murcha Visível",
                "descricao": "O mato de calçada perde a cor e murcha.",
                "icone": "🍂"
            },
            {
                "periodo": "14 a 20 Dias",
                "titulo": "Dessecação Total",
                "descricao": "Limpeza completa das juntas e fendas com ação residual prolongada.",
                "icone": "✨"
            }
        ]
    }
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
    "rendimento": "Rende até 30 m² de calda de pulverização.",
    "destaque": true,
    "preco_base": 24,
    "manual_aplicacao": {
        "resumo_aplicador": "Fungicida concentrado de referência no mercado para prevenção e combate a fungos patogênicos (oídio, ferrugem, podridão, manchas foliares) em orquídeas, rosas e plantas ornamentais.",
        "checklist_previo": [
            "Indicação: Flores, folhagens de vaso, orquídeas, rosas, begônias e samambaias.",
            "Sintomas alvo: Manchas pretas, pó branco (oídio), ferrugem alaranjada ou folhas apodrecendo.",
            "Horário: Pulverizar sempre no início da manhã ou fim da tarde (nunca sob sol quente).",
            "Higiene prévia: Remova e descarte folhas muito comprometidas ou mortas antes de aplicar."
        ],
        "equipamentos": [
            "Borrifador manual limpo de 1 Litro",
            "Luvas de procedimento / descartáveis",
            "Tesoura de poda higienizada (para retirar folhas mortas)",
            "Água limpa e sem cloro excessivo"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Preparo de 1 Litro de Calda",
                "dose": "1 frasco inteiro (10ml) em 1 litro de água",
                "cobertura": "Trata de 20 a 30 vasos médios ou 15 orquídeas adultas"
            },
            "area_total": {
                "titulo": "Caixa Completa / Grandes Canteiros",
                "dose": "10ml para cada litro de água proporcionalmente",
                "cobertura": "Cobertura foliar uniforme de canteiros ornamentais"
            },
            "instrucao_diluicao": "Agite o frasco de 10ml, verta em 1 litro de água limpa, agite bem o borrifador até obter uma calda uniforme e homogênea."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Poda de Limpeza e Aeração",
                "descricao": "Corte com tesoura limpa as partes secas ou tomadas severamente pelo fungo. Isso melhora a circulação de ar na planta.",
                "dica_do_aplicador": "Desinfete a tesoura entre uma planta e outra com álcool 70%."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Use toda a calda preparada no mesmo dia; não guarde calda diluída por semanas."
            },
            {
                "passo": 3,
                "titulo": "Pulverização Completa (Frente e Verso)",
                "descricao": "Borrife a névoa fina cobrindo a parte de cima e principalmente a parte inferior das folhas, onde os fungos se escondem.",
                "dica_do_aplicador": "Em orquídeas, pulverize também sobre o substrato e raízes aéreas com cuidado."
            },
            {
                "passo": 4,
                "titulo": "Monitoramento e Repetição",
                "descricao": "Mantenha o vaso em local bem iluminado e ventilado. Se a infestação for severa, repita a cada 10 a 14 dias.",
                "alerta": "Evite molhar as flores abertas diretamente para não manchar as pétalas."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 Horas",
                "titulo": "Absorção Tecidual",
                "descricao": "Ação protetora e curativa absorvida pelo tecido foliar.",
                "icone": "🌧️"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Paralisação dos Esporos",
                "descricao": "Inativação da germinação de novos esporos do fungo.",
                "icone": "🛑"
            },
            {
                "periodo": "5 a 7 Dias",
                "titulo": "Secagem das Manchas",
                "descricao": "As manchas foliares param de expandir e adquirem bordas secas cicatrizadas.",
                "icone": "🍂"
            },
            {
                "periodo": "14 a 21 Dias",
                "titulo": "Emissão de Folhas Sadias",
                "descricao": "Novas brotações crescem verdes, fortes e livres de mofo.",
                "icone": "🌸"
            }
        ]
    }
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
    "rendimento": "Trata até 10 m² de área foliar ou 25 vasos.",
    "destaque": false,
    "preco_base": 28,
    "manual_aplicacao": {
        "resumo_aplicador": "Versão spray pronta para uso com aplicador em gatilho. Máxima praticidade residencial para proteger orquídeas, samambaias, folhagens e jardins verticais contra fungos patogênicos.",
        "checklist_previo": [
            "Pronto uso: Não requer dosadores, água ou recipientes adicionais.",
            "Gatilho ergonômico: Bico com regulagem para névoa fina delicada.",
            "Flores e vasos: Ideal para quem tem poucos vasos em apartamentos, varandas ou interiores.",
            "Segurança: Baixa toxicidade e odor suave."
        ],
        "equipamentos": [
            "Frasco spray com gatilho original (incluso)",
            "Luvas descartáveis leves"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Aplicação Foliar Direta",
                "dose": "2 a 4 borrifadas por folha afetada",
                "cobertura": "Frasco 240ml trata de 15 a 25 vasos durante semanas"
            },
            "area_total": {
                "titulo": "Tratamento Completo de Jardim Vertical",
                "dose": "Cobertura leve em toda a parede verde",
                "cobertura": "Trata paredes verticais de até 5 a 8 m²"
            },
            "instrucao_diluicao": "NÃO DILUIR. Já vem pronto para o uso com a concentração exata de fábrica."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Agitar o Frasco Spray",
                "descricao": "Agite bem a garrafa de 240ml antes de destravar o gatilho aplicador.",
                "dica_do_aplicador": "Gire o bico na posição SPRAY (névoa ampla) para economizar e cobrir melhor."
            },
            {
                "passo": 2,
                "titulo": "Inspeção das Plantas",
                "descricao": "Olhe de perto orquídeas e samambaias em busca de manchas pretas, pontuações amarelas ou mofo acinzentado.",
                "alerta": "Remova folhas apodrecidas antes de aplicar."
            },
            {
                "passo": 3,
                "titulo": "Aplicação Suave",
                "descricao": "Mantenha cerca de 20 a 25cm de distância e borrife sobre as folhas, cobrindo o verso onde o fungo prolifera.",
                "dica_do_aplicador": "Aplique nas horas frescas da manhã ou no fim de tarde."
            },
            {
                "passo": 4,
                "titulo": "Armazenamento",
                "descricao": "Trave o bico na posição OFF e guarde em local fresco e protegido da luz solar direta.",
                "alerta": "Manter fora do alcance de crianças e animais de estimação."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 Horas",
                "titulo": "Secagem e Fixação",
                "descricao": "Película protetora fungicida seca nas folhas.",
                "icone": "🌧️"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Ambiente Liberado",
                "descricao": "Pode retornar o vaso para a sala ou quarto.",
                "icone": "🐾"
            },
            {
                "periodo": "5 a 7 Dias",
                "titulo": "Estabilização",
                "descricao": "O fungo para de queimar as folhas e o mofo regride.",
                "icone": "🌿"
            },
            {
                "periodo": "15 Dias",
                "titulo": "Recuperação Visível",
                "descricao": "Planta vigorosa com folhagem limpa e brilhante.",
                "icone": "🌸"
            }
        ]
    }
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
    "rendimento": "Rende até 150 m² de calda de pulverização.",
    "destaque": false,
    "preco_base": 30.37,
    "manual_aplicacao": {
        "resumo_aplicador": "Inseticida e repelente fitoterápico 100% natural com sinergia de 12 extratos botânicos. Seguro para hortas caseiras, flores e frutíferas no controle de pulgões, cochonilhas, lagartas e tripes.",
        "checklist_previo": [
            "12 Ativos Botânicos: Alecrim, Alho, Calêndula, Citronela, Cravo-da-Índia, Fumo, Marcela, Pimenta do Reino, Pimenta Malagueta, Sucupira, Rícino e Isasofrol.",
            "Uso em hortas: Ideal para quem quer comer alimentos sem resíduos de venenos químicos pesados.",
            "Carência de consumo: 0 dias (basta lavar as verduras normalmente antes do consumo).",
            "REGRA DE OURO DA DILUIÇÃO: Usar 1 colher de sabão em pó em 1L de água como agente emulsionante/surfactante antes de pingar o Ka-Bio."
        ],
        "equipamentos": [
            "Borrifador manual limpo de 1 Litro",
            "Colher de sopa para medir o sabão em pó",
            "Copo medidor ou dosador de 5ml",
            "Água limpa"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Preparo da Calda Fitoativa (1 Litro)",
                "dose": "5ml de Ka-Bio + 1 colher de sabão em pó em 1L de água",
                "cobertura": "Trata 2 a 3 canteiros de horta ou dezenas de vasos"
            },
            "area_total": {
                "titulo": "Frasco Todo (60ml)",
                "dose": "Rende 12 litros de calda fitoterápica completa",
                "cobertura": "Trata hortas residenciais completas e pomares caseiros"
            },
            "instrucao_diluicao": "PRIMEIRO: dissolva bem 1 colher de sopa rasa de sabão em pó em 1L de água limpa. DEPOIS: adicione 5ml de Ka-Bio e agite vigorosamente até formar uma calda homogênea."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Preparo do Surfactante de Sabão",
                "descricao": "O sabão em pó quebra a tensão da água e dissolve os óleos vegetais essenciais do Ka-Bio, além de quebrar a camada cerosa das cochonilhas e pulgões.",
                "dica_do_aplicador": "Use sabão neutro ou sabão em pó comum bem diluído sem pelotas."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Não faça misturas ou alterações de dosagem sem orientação técnica."
            },
            {
                "passo": 3,
                "titulo": "Pulverização Direta nas Pragas",
                "descricao": "Borrife atingindo diretamente os pulgões e cochonilhas acumulados nas pontas dos brotos, folhas e caules.",
                "dica_do_aplicador": "Aplique sempre no final da tarde, após as 17h, para os óleos botânicos não queimarem folhas ao sol."
            },
            {
                "passo": 4,
                "titulo": "Frequência de Controle",
                "descricao": "Repita a aplicação a cada 3 a 5 dias até a eliminação completa da colônia de pragas.",
                "dica_do_aplicador": "Em hortas, faça aplicações preventivas semanais para manter pragas afastadas."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "Imediato",
                "titulo": "Ação Repelente e Asfixiante",
                "descricao": "O aroma dos fitoativos afasta insetos e o óleo quebra a proteção das cochonilhas.",
                "icone": "🌿"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Mortalidade de Sugadores",
                "descricao": "Pulgões e tripes morrem desidratados e paralisados nas folhas.",
                "icone": "🍂"
            },
            {
                "periodo": "48 Horas",
                "titulo": "Limpeza da Planta",
                "descricao": "Redução drástica das colônias de insetos nos brotos novos.",
                "icone": "✨"
            },
            {
                "periodo": "7 Dias",
                "titulo": "Horta Revigorada",
                "descricao": "Planta livre de mastigadores e com vigor natural estimulado.",
                "icone": "🥦"
            }
        ]
    }
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
    "rendimento": "Trata até 10 m² de área foliar ou 50 vasos.",
    "destaque": false,
    "preco_base": 21.93,
    "emEstoque": false,
    "manual_aplicacao": {
        "resumo_aplicador": "Inseticida e repelente botânico pronto para uso em spray. Aplicação imediata para hortas de varanda, vasos de tempero e folhagens, eliminando pragas sem venenos sintéticos.",
        "checklist_previo": [
            "Pronto uso com gatilho: Sem sujeira nem necessidade de diluição caseira prévia.",
            "Seguro para alimentos: Manjericão, hortelã, alecrim, couve, tomate cereja e flores comestíveis.",
            "Ação tripla: Inseticida de contato, repelente e aromatizador protetor.",
            "Horário: Aplicar preferencialmente ao entardecer."
        ],
        "equipamentos": [
            "Frasco spray original com gatilho regulável",
            "Pano úmido para limpeza de folhas muito atacadas"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Aplicação Direta em Vasos de Tempero",
                "dose": "2 a 3 borrifadas diretamente sobre a colônia de pragas",
                "cobertura": "Trata floreiras e vasinhos individuais"
            },
            "area_total": {
                "titulo": "Frasco Todo (240ml)",
                "dose": "Uso pleno puro",
                "cobertura": "Até 50 aplicações pontuais em hortas de apartamento"
            },
            "instrucao_diluicao": "NÃO ADICIONAR ÁGUA. Formulação equilibrada pronta para aspergir diretamente na praga."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Agitar Antes de Usar",
                "descricao": "Agite a garrafa para emulsionar os óleos de alho, citronela e calêndula com a base líquida.",
                "dica_do_aplicador": "Abra o bico ajustando para jato de névoa fina."
            },
            {
                "passo": 2,
                "titulo": "Localização dos Focos",
                "descricao": "Verifique o verso das folhas de couve e brotos tenros de hortelã onde os pulgões pretos e verdes se concentram.",
                "alerta": "Não aplique sob sol do meio-dia."
            },
            {
                "passo": 3,
                "titulo": "Borrifar Sobre os Insetos",
                "descricao": "Borrife a curta distância (15cm) cobrindo bem os pulgões e cochonilhas de carapaça branca.",
                "dica_do_aplicador": "Para folhas que serão consumidas no dia, colha antes da aplicação ou lave normalmente com água corrente."
            },
            {
                "passo": 4,
                "titulo": "Reaplicação",
                "descricao": "Reaplique a cada 4 dias caso novos pulgões eclodam de ovos remanescentes.",
                "dica_do_aplicador": "Funciona também como repelente de lagartas e mosca-branca."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "1 a 2 Horas",
                "titulo": "Fixação Botânica",
                "descricao": "Cheiro característico repele novas pragas voadoras.",
                "icone": "🌿"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Morte das Pragas",
                "descricao": "Pulgões e cochonilhas secam nas hastes e caem.",
                "icone": "🍂"
            },
            {
                "periodo": "3 Dias",
                "titulo": "Brotação Protegida",
                "descricao": "Brotos novos crescem sem deformidades.",
                "icone": "✨"
            },
            {
                "periodo": "7 Dias",
                "titulo": "Equilíbrio Natural",
                "descricao": "Horta livre de pragas com sabor e segurança garantidos.",
                "icone": "🥗"
            }
        ]
    }
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
    "rendimento": "Trata até 150 m² de área aplicada.",
    "destaque": true,
    "preco_base": 48,
    "manual_aplicacao": {
        "resumo_aplicador": "Inseticida domissanitário pronto uso de ação deletéria sem choque instantâneo. O inseto não morre na hora: ele caminha, transporta o veneno e contamina todo o ninho em 48h.",
        "checklist_previo": [
            "Pragas alvo: Baratas, aranhas, cupins, formigas, escorpiões e pulgas.",
            "Mecanismo estratégico: Efeito não repelente e sem choque imediato (para o inseto levar o produto para o esconderijo).",
            "Locais ideais: Rodapés, ralos, caixas de gordura, frestas de paredes e trilhas.",
            "Características: Não mancha pisos, azulejos ou paredes e não tem odor forte."
        ],
        "equipamentos": [
            "Frasco com gatilho original ou borrifador",
            "Luvas descartáveis para manuseio de ralos",
            "Pano para secar respingos em bancadas de alimentos"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Aplicação em Frestas e Ralos",
                "dose": "3 a 5 borrifadas por ralo ou fresta",
                "cobertura": "Trata pontos críticos de cozinhas e banheiros"
            },
            "area_total": {
                "titulo": "Frascos 250ml ou 500ml",
                "dose": "Aplicação contínua em rodapés a cada 5 metros",
                "cobertura": "500ml cobre residências de até 150 m²"
            },
            "instrucao_diluicao": "PRONTO USO. Não misturar água; aplicar diretamente no caminho dos insetos."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Mapeamento dos Pontos Estratégicos",
                "descricao": "Identifique ralos, frestas de portas, caixas de gordura, rodapés escuros e fendas atrás de armários.",
                "dica_do_aplicador": "Não borrife em cima de alimentos ou utensílios de cozinha."
            },
            {
                "passo": 2,
                "titulo": "Aplicação em Barreira Perimetral",
                "descricao": "Mantenha o frasco a cerca de 20cm da superfície e borrife formando uma faixa de 10cm ao longo dos rodapés e cantos.",
                "alerta": "Não passe pano úmido logo após aplicar; deixe o produto secar para formar a película residual."
            },
            {
                "passo": 3,
                "titulo": "Tratamento de Ralos e Caixas de Passagem",
                "descricao": "Abra a tampa do ralo e borrife diretamente nas paredes internas e no sifão.",
                "dica_do_aplicador": "Faça essa aplicação à noite, antes de dormir, quando os ralos ficam secos e os insetos saem."
            },
            {
                "passo": 4,
                "titulo": "Compreensão do Efeito",
                "descricao": "Não se assuste se ver baratas saindo lentas no dia seguinte; é o sinal de contaminação que levará à morte da colônia no ninho.",
                "alerta": "Recolha e descarte os insetos mortos longe de animais de estimação."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 Horas",
                "titulo": "Secagem da Película",
                "descricao": "O líquido seca sem deixar manchas ou odores.",
                "icone": "🛡️"
            },
            {
                "periodo": "24 a 48 Horas",
                "titulo": "Contaminação em Cadeia",
                "descricao": "Insetos contaminados infectam ninhos e colônias.",
                "icone": "⚡"
            },
            {
                "periodo": "3 a 5 Dias",
                "titulo": "Queda Drástica",
                "descricao": "Morte massiva de baratas, formigas e aranhas.",
                "icone": "🍂"
            },
            {
                "periodo": "Até 90 Dias",
                "titulo": "Ação Residual",
                "descricao": "Proteção contínua contra novos invasores que cruzarem a barreira.",
                "icone": "✨"
            }
        ]
    }
  },
  {
    "id": 14,
    "nome": "Fimo Combina Spray (40ml)",
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
    "rendimento": "Trata até 120 m² de área com proteção residual.",
    "destaque": false,
    "preco_base": 21.20,
    "manual_aplicacao": {
        "resumo_aplicador": "Inseticida spray formulado com ATRATIVO SEXUAL E ALIMENTAR integrado. Não precisa acertar o inseto diretamente: ele é atraído para a película e morre, com residual de até 6 meses.",
        "checklist_previo": [
            "Grande diferencial: Formulado com atrativo — a praga sai do esconderijo e caminha sobre o veneno.",
            "Alvos: Aranhas, baratas, escorpiões, cupins e formigas.",
            "Durabilidade extrema: Residual protetor de até 180 dias (6 meses) em superfícies secas e cobertas.",
            "Aplicação limpa: Seguro para ambientes internos e áreas de serviço."
        ],
        "equipamentos": [
            "Frasco spray aplicador de 40ml ou 120ml",
            "Luvas de procedimento simples"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Aplicação por Ponto Atrativo",
                "dose": "1 a 2 borrifadas a cada 2 metros lineares",
                "cobertura": "Trata frestas, batentes de porta e rodapés"
            },
            "area_total": {
                "titulo": "Frasco 120ml",
                "dose": "Aplicação perimetral completa",
                "cobertura": "Trata apartamentos e casas de até 120 m² com residual longo"
            },
            "instrucao_diluicao": "PRONTO USO. Agitar antes de borrifar."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Localização das Trilhas e Entradas",
                "descricao": "Borrife nas soleiras de portas, frestas de janelas, atrás de geladeiras e sob máquinas de lavar.",
                "dica_do_aplicador": "Você não precisa ver a barata ou aranha para aplicar; o atrativo chama o inseto para a área tratada."
            },
            {
                "passo": 2,
                "titulo": "Aplicação em Faixa Discreta",
                "descricao": "Aplique a 20cm de distância formando uma linha contínua nos cantos.",
                "alerta": "Evite lavar o rodapé com cloro ou ceras pesadas nos dias seguintes para não remover a película."
            },
            {
                "passo": 3,
                "titulo": "Combate a Escorpiões e Aranhas",
                "descricao": "Borrife ao redor de caixas de esgoto, entulhos de quintal e batentes de portas de entrada.",
                "dica_do_aplicador": "Escorpiões morrem ao se deslocarem em busca de baratas contaminadas."
            },
            {
                "passo": 4,
                "titulo": "Manutenção Semestral",
                "descricao": "Reaplique a cada 6 meses para manter a residência blindada o ano todo.",
                "alerta": "Manter longe de alimentos e bebedouros de animais."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "1 Hora",
                "titulo": "Ativação do Atrativo",
                "descricao": "A película seca e libera os atrativos olfativos para as pragas.",
                "icone": "👃"
            },
            {
                "periodo": "24 a 72 Horas",
                "titulo": "Atração e Contato",
                "descricao": "Os insetos caminham sobre a barreira e absorvem a dose letal.",
                "icone": "⚡"
            },
            {
                "periodo": "7 Dias",
                "titulo": "Limpeza de Focos",
                "descricao": "Eliminação total de ninhos e invasores ocultos.",
                "icone": "🍂"
            },
            {
                "periodo": "Até 6 Meses",
                "titulo": "Barreira Residual",
                "descricao": "Película ativa protegendo a casa contra reinfestações.",
                "icone": "🛡️"
            }
        ]
    }
  },
  {
    "id": 15,
    "nome": "Pankada Multi-Insetos (60ml)",
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
    "rendimento": "Rende até 600 m² de calda de pulverização.",
    "destaque": true,
    "preco_base": 32.47,
    "manual_aplicacao": {
        "resumo_aplicador": "Inseticida concentrado multi-pragas de altíssimo poder residual (até 180 dias). Elimina ácaros, baratas germânicas, bicudo, cascudinho, mosca-branca, larva-mineradora e tripes.",
        "checklist_previo": [
            "Concentrado profissional: Rende grandes volumes de calda com apenas 3ml por litro.",
            "Multi-ambiente: Indicado para residências, galpões, depósitos e áreas agrícolas.",
            "Excelente para cascudinho de aviário e baratas germânicas de restaurantes.",
            "EPI obrigatório no preparo da calda concentrada."
        ],
        "equipamentos": [
            "Pulverizador costal ou de pressão com bico leque",
            "Seringa ou copo graduado para medir 3ml",
            "Luvas nitrílicas, máscara com filtro e óculos de proteção"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Preparo de 1 Litro de Calda",
                "dose": "Diluir 3ml em 1 litro de água limpa",
                "cobertura": "Pulverizar 10 ml de calda por metro quadrado tratado"
            },
            "area_total": {
                "titulo": "Frasco 60ml ou 250ml",
                "dose": "3ml por litro (60ml rende 20L de calda)",
                "cobertura": "20L de calda cobrem até 2.000 m² de superfície pulverizada"
            },
            "instrucao_diluicao": "Coloque água até a metade do tanque, meça 3ml de Pankada por litro, adicione, mexa bem e complete com água limpa."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Isolamento da Área e EPIs",
                "descricao": "Retire pessoas, crianças e animais do local. Coloque máscara e luvas antes de abrir a embalagem concentrada.",
                "alerta": "Nunca prepare a mistura em pias de cozinha ou perto de alimentos."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Respeite rigorosamente a dosagem recomendada pelo fabricante e utilize EPIs completos."
            },
            {
                "passo": 3,
                "titulo": "Pulverização em Superfícies e Frestas",
                "descricao": "Aplique uniformemente nos esconderijos das pragas, frestas de alvenaria, pisos e rodapés.",
                "dica_do_aplicador": "Em galpões e depósitos, foque nos cantos escuros e estrados de madeira."
            },
            {
                "passo": 4,
                "titulo": "Tempo de Reentrada e Ventilação",
                "descricao": "Mantenha o ambiente fechado por 1 a 2 horas e depois ventile por mais 2 horas antes de liberar o acesso.",
                "alerta": "Lave as mãos e o equipamento com água e sabão após a aplicação."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 a 4 Horas",
                "titulo": "Secagem e Reentrada",
                "descricao": "Liberação de acesso após secagem e ventilação.",
                "icone": "💨"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Morte Rápida",
                "descricao": "Mortalidade massiva de cascudinhos, baratas e ácaros.",
                "icone": "⚡"
            },
            {
                "periodo": "30 Dias",
                "titulo": "Controle Contínuo",
                "descricao": "Interrupção do ciclo reprodutivo no ambiente.",
                "icone": "🛑"
            },
            {
                "periodo": "Até 180 Dias",
                "titulo": "Efeito Prolongado",
                "descricao": "Residual garantido de até 6 meses contra reinfestações.",
                "icone": "🛡️"
            }
        ]
    }
  },
  {
    "id": 16,
    "nome": "UNIX Repik (30ml)",
    "categoria": "inseticidas",
    "tipo_formulacao": "concentrado",
    "o_que_faz": "Fipronil + Lambda para controle definitivo de cupins. Produto sem cheiro. Não mancha paredes.",
    
    "para_que_serve": "Combinação técnica de Fipronil + Lambda-Cialotrina para erradicação de cupins de madeira seca, cupins de solo, baratas e formigas.",
    "como_age": "Ação de transferência: os alvos contaminados levam o veneno para o ninho subterrâneo ou madeiramento, eliminando a colônia inteira. Produto sem cheiro. Não mancha paredes.",
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
      "lambda cialotrina",
      "escorpião"
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
    "rendimento": "Trata até 100 metros lineares ou 150 m² de área.",
    "destaque": false,
    "preco_base": 13.50,
    "manual_aplicacao": {
        "resumo_aplicador": "Inseticida de alta performance em dose compacta (30ml) para ambientes domésticos, formulado para erradicar baratas, cupins e formigas resistentes.",
        "checklist_previo": [
            "Pragas resistentes: Indicado quando outros inseticidas comuns perderam a eficácia.",
            "Ação cupinicida: Excelente penetração em madeiras, rodapés e caixilhos.",
            "Uso domiciliar controlado.",
            "Embalagem prática de 30ml."
        ],
        "equipamentos": [
            "Pulverizador manual de 1 a 2 litros",
            "Luvas de borracha e máscara protetora",
            "Dosador graduado"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Preparo para Pulverizador Manual (1 Litro)",
                "dose": "5 a 10 ml por litro de água",
                "cobertura": "Trata frestas de portas, rodapés e móveis atacados"
            },
            "area_total": {
                "titulo": "Frasco Todo (30ml)",
                "dose": "30ml em 3 a 5 litros de água",
                "cobertura": "Trata uma residência completa contra baratas e cupins"
            },
            "instrucao_diluicao": "Agite o frasco de 30ml, adicione no pulverizador com água limpa e agite para homogeneizar."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Identificação dos Ninhos de Cupim e Baratas",
                "descricao": "Localize fezes de cupim (pó de madeira) ou trilhas de formigas e esconderijos de baratas.",
                "dica_do_aplicador": "Em cupins de madeira seca, injete a calda nos furos existentes com seringa."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Não aplicar sobre tomadas ou fiações elétricas desencapadas."
            },
            {
                "passo": 3,
                "titulo": "Pulverização Direcionada",
                "descricao": "Borrife nas frestas, batentes de madeira, conduítes desenergizados e rodapés.",
                "dica_do_aplicador": "Aplique com o bico em jato dirigido para penetrar nas fendas."
            },
            {
                "passo": 4,
                "titulo": "Secagem e Reocupação",
                "descricao": "Aguarde 2 horas para ventilar e secar antes de recolocar tapetes e móveis.",
                "alerta": "Manter animais longe durante a secagem."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 Horas",
                "titulo": "Penetração",
                "descricao": "Fixação nas fibras de madeira e alvenaria.",
                "icone": "🌧️"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Choque e Parada",
                "descricao": "Cessação da atividade de cupins e morte de baratas.",
                "icone": "⚡"
            },
            {
                "periodo": "7 Dias",
                "titulo": "Eliminação da Colônia",
                "descricao": "Erradicação dos focos resistentes no ambiente.",
                "icone": "🍂"
            },
            {
                "periodo": "90 Dias",
                "titulo": "Proteção Residual",
                "descricao": "Madeira e rodapés protegidos contra novos ataques.",
                "icone": "🛡️"
            }
        ]
    }
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
      "baratas",
      "escorpiões",
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
    "rendimento": "Rende até 100 m² de calda de pulverização.",
    "destaque": false,
    "preco_base": 12.12,
    "manual_aplicacao": {
        "resumo_aplicador": "Formulação concentrada em pó molhável de Lambda-Cialotrina 10% em sachês hidrossolúveis. Potência máxima de choque para controle de infestações severas de solo e lava-pés.",
        "checklist_previo": [
            "Concentração profissional (Lambda-Cialotrina 10%): Choque rápido e efeito residual potente.",
            "Sachê hidrossolúvel de 10g: Dissolve na água sem contato com pó.",
            "Infestações severas: Ideal quando formigueiros estão resistentes ou muito populosos.",
            "Diluição concentrada: 1 sachê de 10g em 1 litro de água limpa."
        ],
        "equipamentos": [
            "Pulverizador manual de 1 a 2 litros ou regador",
            "Luvas de borracha e máscara",
            "Botas de borracha"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Dose Concentrada para Ninhos",
                "dose": "1 sachê de 10g em 1 litro de água",
                "cobertura": "Aplica 30ml de calda por m² sobre os focos"
            },
            "area_total": {
                "titulo": "Envelope c/ 3 Sachês (30g)",
                "dose": "3 sachês em 3 litros de água concentrada",
                "cobertura": "Trata até 30 a 50 formigueiros ativos de grande porte"
            },
            "instrucao_diluicao": "Coloque 1 litro de água limpa no pulverizador, adicione o sachê hidrossolúvel fechado, aguarde a dissolução da película e agite bem."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Preparo da Solução Concentrada",
                "descricao": "Deixe o sachê dissolver no litro de água. A calda ficará branca leitosa homogênea.",
                "alerta": "Use luvas durante o manuseio para total segurança."
            },
            {
                "passo": 2,
                "titulo": "Aplicação Direta no Olheiro",
                "descricao": "Perfure levemente o topo do formigueiro com uma vara e despeje a calda concentrada para penetrar até o fundo da colônia.",
                "dica_do_aplicador": "Aplique nas horas da manhã quando as formigas estão ativas nas galerias superiores."
            },
            {
                "passo": 3,
                "titulo": "Pulverização ao Redor",
                "descricao": "Pulverize um raio de 1 metro ao redor do ninho para atingir as formigas que saírem assustadas.",
                "dica_do_aplicador": "O efeito de choque paralisa as formigas em poucos minutos."
            },
            {
                "passo": 4,
                "titulo": "Verificação",
                "descricao": "No dia seguinte, bata levemente no montículo para confirmar a ausência de movimento.",
                "alerta": "Não aplicar próximo a poços de água potável ou tanques de peixes (tóxico para organismos aquáticos)."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "15 Minutos",
                "titulo": "Efeito de Choque",
                "descricao": "Ação neurotóxica imediata sobre as formigas atingidas.",
                "icone": "⚡"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Erradicação do Ninho",
                "descricao": "Morte de 100% dos indivíduos no ninho tratado.",
                "icone": "🛑"
            },
            {
                "periodo": "3 a 5 Dias",
                "titulo": "Desintegração da Terra",
                "descricao": "O formigueiro é abandonado e desmorona com a chuva.",
                "icone": "🍂"
            },
            {
                "periodo": "90 Dias",
                "titulo": "Efeito Residual",
                "descricao": "Proteção duradoura contra novas infestações no ponto tratado.",
                "icone": "🛡️"
            }
        ]
    }
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
    "rendimento": "Trata até 10 m² de área aplicada.",
    "destaque": true,
    "preco_base": 11.68,
    "manual_aplicacao": {
        "resumo_aplicador": "Isca mosquicida granulada com Thiametoxam 1% e Atrativo Sexual (Z-9-Tricosene). Venda livre, atrai moscas a longas distâncias e elimina adultos, larvas e pupas.",
        "checklist_previo": [
            "Atrativo sexual de alta atração: As moscas são atraídas pelo feromônio e pousam para se alimentar.",
            "Uso versátil: Pode ser espalhado no piso ou colocado em recipientes suspensos.",
            "Segurança para pets: Colocar em pratinhos suspensos fora do alcance de cães e gatos.",
            "Ação ampla: Excelente para varandas, churrasqueiras, lixeiras, estábulos e composteiras."
        ],
        "equipamentos": [
            "Pratinhos plásticos descartáveis ou tampinhas",
            "Fita adesiva ou barbante (para pendurar potinhos)",
            "Luvas descartáveis"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Potinhos Suspensos (Recomendado)",
                "dose": "2g a 5g de grânulos por recipiente",
                "cobertura": "Distribuir 1 potinho a cada 5 a 10 metros quadrados"
            },
            "area_total": {
                "titulo": "Espalhamento Direto no Solo",
                "dose": "3g por metro quadrado (30g para cada 10m²)",
                "cobertura": "Sachê de 20g cobre de 7 a 10 m² de piso"
            },
            "instrucao_diluicao": "ISCA PRONTA USO EM GRÂNULOS. Não molhar nem diluir em água."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Identificação dos Pontos Críticos de Moscas",
                "descricao": "Localize áreas com acúmulo de moscas: perto de lixeiras, muretas ensolaradas, varandas e canis.",
                "dica_do_aplicador": "Moscas adoram superfícies claras e quentes iluminadas pelo sol da manhã."
            },
            {
                "passo": 2,
                "titulo": "Disposição em Potinhos Suspensos",
                "descricao": "Coloque 2g a 5g de grânulos de NaMosca GB em potinhos ou bandejas plásticas. Posicione a 1,5m do solo (em parapeitos, muretas ou batentes).",
                "alerta": "NUNCA deixe a isca ao alcance de cães, gatos ou crianças."
            },
            {
                "passo": 3,
                "titulo": "Ação Atrativa e Ingestão",
                "descricao": "As moscas pousam atraídas pelo feromônio Z-9-Tricosene, consomem os grânulos doces e morrem a poucos centímetros da isca.",
                "dica_do_aplicador": "Umedeça levemente a isca com 2 gotas de água caso o clima esteja muito seco para intensificar o aroma."
            },
            {
                "passo": 4,
                "titulo": "Reposição dos Grânulos",
                "descricao": "Quando a isca for totalmente consumida ou coberta de poeira após algumas semanas, reponha novos grânulos.",
                "alerta": "Descarte as moscas mortas no lixo orgânico lacrado."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "10 Minutos",
                "titulo": "Atração Sexual",
                "descricao": "Moscas detectam o feromônio e pousam sobre a isca.",
                "icone": "🪰"
            },
            {
                "periodo": "1 a 2 Horas",
                "titulo": "Morte por Ingestão",
                "descricao": "Mortalidade rápida logo após a primeira ingestão.",
                "icone": "⚡"
            },
            {
                "periodo": "24 a 48 Horas",
                "titulo": "Redução Notável",
                "descricao": "Queda de até 90% da população de moscas no ambiente.",
                "icone": "📉"
            },
            {
                "periodo": "4 a 6 Semanas",
                "titulo": "Ação Contínua",
                "descricao": "A isca permanece ativa no potinho atraindo novos insetos.",
                "icone": "✨"
            }
        ]
    }
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
    "rendimento": "Trata até 500 m² de área construída ou galpão.",
    "destaque": true,
    "preco_base": 52.76,
    "manual_aplicacao": {
        "resumo_aplicador": "Mosquicida concentrado de alto rendimento (Thiamethoxam 25%) para granjas, frigoríficos, haras e laticínios. Métodos consagrados de barbante embebido, pincelamento e pulverização com açúcar.",
        "checklist_previo": [
            "Uso profissional/rural: Desenvolvido para infestações severas de moscas em criações de animais e agroindústrias.",
            "Três métodos de ouro: 1) Barbante com açúcar, 2) Pincelamento em placas, 3) Pulverização residual.",
            "Adição de açúcar: O açúcar cristal atua como atrativo alimentar e adesivo natural.",
            "Durabilidade: Residual de 4 a 6 semanas nas superfícies tratadas."
        ],
        "equipamentos": [
            "Barbante de algodão grosso ou tiras de tecido (para método do barbante)",
            "Pincel médio de 2 polegadas (para pincelamento)",
            "Placas de papelão ou plástico 10x30cm",
            "Açúcar cristal comum e balde misturador"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Método do Pincelamento com Açúcar",
                "dose": "30g de BleKalt + 30g de açúcar em 60ml de água",
                "cobertura": "Pincelar em 10 a 15 faixas de 10x30cm suspensas"
            },
            "area_total": {
                "titulo": "Método do Barbante Embebido",
                "dose": "30g de BleKalt + 150g de açúcar em 300ml de água",
                "cobertura": "Embeber 50 metros de barbante e pendurar a 2m do solo"
            },
            "instrucao_diluicao": "Dissolva primeiro o açúcar na água limpa até formar uma calda doce e densa. Depois adicione o pó de BleKalt 25 e mexa até virar uma pasta fluida homogênea."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Escolha do Método de Aplicação",
                "descricao": "Para galpões com animais: use Barbante Embebido ou Placas Pinceladas suspensas no teto, fora do alcance dos animais. Para lixeiras e paredes: use pulverização a 3g/L.",
                "dica_do_aplicador": "Moscas repousam nas partes altas e cabos suspensos à noite; o barbante atinge o ponto exato de pouso."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Use luvas e máscara durante o preparo para não respirar o pó."
            },
            {
                "passo": 3,
                "titulo": "Instalação no Galpão",
                "descricao": "Pendure os barbantes ou as placas de papelão pinceladas horizontalmente a 2 metros de altura do chão.",
                "dica_do_aplicador": "Em locais muito quentes, borrife água pura nas placas a cada 10 dias para reativar o açúcar cristalizado."
            },
            {
                "passo": 4,
                "titulo": "Monitoramento e Troca",
                "descricao": "A ação dura de 4 a 6 semanas. Troque os barbantes quando a infestação estiver controlada.",
                "alerta": "Nunca pincele em comedouros ou bebedouros dos animais."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "30 Minutos",
                "titulo": "Atração Alimentar",
                "descricao": "Moscas se alimentam da calda doce com Thiamethoxam.",
                "icone": "🪰"
            },
            {
                "periodo": "2 a 4 Horas",
                "titulo": "Queda em Massa",
                "descricao": "Mortalidade contínua no piso do galpão.",
                "icone": "⚡"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Redução Drástica",
                "descricao": "Ambiente do estábulo ou granja visivelmente aliviado.",
                "icone": "📉"
            },
            {
                "periodo": "4 a 6 Semanas",
                "titulo": "Ação Residual",
                "descricao": "Residual persistente sem perda de eficácia.",
                "icone": "🛡️"
            }
        ]
    }
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
    "rendimento": "Rende até 600 m² de calda de pulverização.",
    "destaque": false,
    "preco_base": 40.84,
    "manual_aplicacao": {
        "resumo_aplicador": "Mosquicida líquido concentrado de ação rápida para controle de moscas em restaurantes, lanchonetes, padarias e residências. Uso em pulverização ou pincelamento discreto.",
        "checklist_previo": [
            "Ambientes alimentícios: Desenvolvido para áreas comerciais e de alimentação (respeitando carência e normas sanitárias).",
            "Dois modos de uso: Pulverização total de superfícies ou pincelamento focado em vigas e batentes.",
            "Sem cheiro residual desagradável após a secagem.",
            "Seguro após secagem completa."
        ],
        "equipamentos": [
            "Pulverizador manual ou costal",
            "Pincel pequeno para áreas discretas",
            "Dosador graduado de mililitros"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Modo Pincelamento Localizado",
                "dose": "O uso do frasco requer seguir as instruções específicas de diluição para o volume de água adequado.",
                "cobertura": "Pincelar em batentes, muretas e vigas onde moscas pousam"
            },
            "area_total": {
                "titulo": "Modo Pulverização Total",
                "dose": "Diluir 3ml por litro de água limpa",
                "cobertura": "Frasco de 60ml rende 20 litros de calda para cobrir grandes paredes"
            },
            "instrucao_diluicao": "Dilua a quantidade recomendada em água limpa, misture bem e aplique sobre os pontos de pouso preferidos das moscas."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Identificação dos Locais de Pouso",
                "descricao": "Moscas buscam batentes de portas de cozinha, vigas de teto, bordas de lixeiras e paredes externas quentes.",
                "dica_do_aplicador": "Em cozinhas profissionais, aplique após o expediente com o local limpo e alimentos guardados."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Não pulverizar sobre bancadas de preparo de comida ou pratos."
            },
            {
                "passo": 3,
                "titulo": "Aplicação Cuidadosa",
                "descricao": "Pincele ou pulverize uma película fina sobre os locais identificados. O produto seca transparente.",
                "dica_do_aplicador": "Aplique também nas lixeiras externas e caixas de gordura do estabelecimento."
            },
            {
                "passo": 4,
                "titulo": "Reabertura do Local",
                "descricao": "Aguarde 1 hora de secagem e ventilação antes de retomar as atividades normais da cozinha.",
                "alerta": "Descarte as moscas caídas no chão antes de iniciar o atendimento."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "1 Hora",
                "titulo": "Secagem e Fixação",
                "descricao": "A calda seca e cria barreira letal invisível.",
                "icone": "💨"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Controle de População",
                "descricao": "Moscas que pousam absorvem o ativo e morrem rapidamente.",
                "icone": "⚡"
            },
            {
                "periodo": "3 a 5 Dias",
                "titulo": "Ambiente Sanitizado",
                "descricao": "Redução expressiva de moscas circulando na área de clientes.",
                "icone": "✨"
            },
            {
                "periodo": "30 Dias",
                "titulo": "Eficácia Residual",
                "descricao": "Proteção contínua contra moscas invasoras.",
                "icone": "🛡️"
            }
        ]
    }
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
    "rendimento": "Trata até 50 m² de área ou dezenas de ninhos.",
    "destaque": true,
    "preco_base": 11.68,
    "manual_aplicacao": {
        "resumo_aplicador": "Mata-Formiga Gel de última geração com Indoxacarbe em seringa aplicadora de 10g. Efeito Dominó por trofalaxia: as operárias levam o gel para dentro do ninho, alimentam a rainha e exterminam toda a colônia em até 72h.",
        "checklist_previo": [
            "Pragas alvo: Formigas doceiras e caseiras (Tapinoma melanocephalum, Monomorium, formiga fantasma).",
            "REGRA DE OURO 1: NUNCA passe veneno líquido spray onde colocou o gel; o spray repele a formiga e impede o carregamento ao ninho.",
            "REGRA DE OURO 2: Aplicar pequenos pontinhos discretos (tamanho de cabeça de palito de dente), nunca filetes compridos.",
            "Sem cheiro e sem manchas: Seguro para ser colocado perto de frestas de pias e armários."
        ],
        "equipamentos": [
            "Seringa aplicadora dosadora de 10g (inclusa no produto)",
            "Pano seco para limpar previamente o local de poeira"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Pontos de Gel em Cozinhas",
                "dose": "1 a 2 gotas (0,5cm) a cada metro ao longo da trilha",
                "cobertura": "Trata frestas de azulejos, pias e tomadas"
            },
            "area_total": {
                "titulo": "Seringa Completa (10g)",
                "dose": "Até 100 a 150 pontos de gel distribuídos",
                "cobertura": "Elimina múltiplos ninhos em residências completas"
            },
            "instrucao_diluicao": "NÃO DILUIR. Aplicar o gel puro diretamente da seringa."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Localização da Trilha de Formigas",
                "descricao": "Observe onde as formigas doceiras estão caminhando: frestas de pias, atrás do micro-ondas, tomadas elétricas ou rodapés.",
                "dica_do_aplicador": "Não mate as formigas que estão andando; elas são suas 'transportadoras' que levarão o veneno para a rainha."
            },
            {
                "passo": 2,
                "titulo": "Aplicação dos Pontos de Gel",
                "descricao": "Retire a tampa da seringa e aperte suavemente o êmbolo. Deposite gotas do tamanho de uma lentilha ao lado da trilha.",
                "alerta": "Nunca coloque o gel dentro de pratos ou recipientes que serão lavados."
            },
            {
                "passo": 3,
                "titulo": "Consumo e Trofalaxia no Ninho",
                "descricao": "As formigas se aglomeram na gota de gel, ingerem o produto e voltam para o ninho. Pelo processo de trofalaxia, regurgitam o alimento contaminado para a rainha e as larvas.",
                "dica_do_aplicador": "O Indoxacarbe tem ação bioativada no estômago do inseto, garantindo que a operária viva tempo suficiente para chegar à rainha."
            },
            {
                "passo": 4,
                "titulo": "Manutenção",
                "descricao": "Se as formigas comerem toda a gotinha em poucas horas, reponha outro ponto no mesmo lugar até que nenhuma formiga apareça.",
                "alerta": "Recoloque a tampa na seringa e guarde em local fresco."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "2 a 4 Horas",
                "titulo": "Atração Máxima",
                "descricao": "Operárias se alimentam avidamente do atrativo palatável.",
                "icone": "🐜"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Distribuição no Ninho",
                "descricao": "A rainha e as larvas ingerem o gel compartilhado.",
                "icone": "👑"
            },
            {
                "periodo": "48 Horas",
                "titulo": "Início da Mortalidade",
                "descricao": "Morte da rainha e das operárias nas câmaras do ninho.",
                "icone": "⚡"
            },
            {
                "periodo": "72 Horas",
                "titulo": "Colapso Total da Colônia",
                "descricao": "Extermínio de 100% do ninho com fim definitivo das formigas na casa.",
                "icone": "✨"
            }
        ]
    }
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
    "rendimento": "Trata até 40 m² de frestas e superfícies.",
    "destaque": true,
    "preco_base": 7.9885,
    "manual_aplicacao": {
        "resumo_aplicador": "Mata-Barata Gel de alta atratividade com Imidacloprid em seringa de 10g. Combate definitivo da Barata Francesinha/de cozinha (Blattella germanica) e baratas de esgoto por contaminação secundária (necrofagia/coprofagia).",
        "checklist_previo": [
            "Especialista em baratinha de cozinha (germânica): Praga resistente que vive em motores de geladeira e frestas de armários.",
            "Mecanismo em cadeia: As baratas no ninho comem os excrementos e carcaças das baratas mortas (coprofagia e necrofagia), multiplicando o veneno.",
            "Sem cheiro e sem desocupar a cozinha: Não precisa tirar louças ou talheres dos armários.",
            "Gotas pequenas: Aplicar pequenas gotas em cantos escuros e protegidos."
        ],
        "equipamentos": [
            "Seringa aplicadora dosadora de 10g",
            "Papel toalha para limpeza prévia de gordura nos cantos"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Pontos em Armários e Eletros",
                "dose": "1 gota (tamanho de grão de arroz) por metro linear",
                "cobertura": "Atrás de geladeira, fogão, dobradiças e cantos de gavetas"
            },
            "area_total": {
                "titulo": "Seringa 10g (Uso Geral)",
                "dose": "80 a 120 pontos de gel distribuídos",
                "cobertura": "Trata cozinhas completas de residências e lanchonetes"
            },
            "instrucao_diluicao": "USO DIRETO. Não diluir em água."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Inspeção dos Esconderijos Quentes",
                "descricao": "Procure frestas escuras e quentes: dobradiças de armários, sob o motor da geladeira, atrás do micro-ondas, gavetas de talheres e fendas de bancada.",
                "dica_do_aplicador": "Limpe o excesso de gordura da superfície antes de aplicar o gel para melhorar a aderência e atratividade."
            },
            {
                "passo": 2,
                "titulo": "Aplicação dos Pontos de Gel",
                "descricao": "Pressione a seringa aplicando pequenas gotas discretas nos cantos mais escondidos.",
                "alerta": "NÃO passe veneno aerosol ou spray por cima do gel; o cheiro do spray faz a barata rejeitar a isca."
            },
            {
                "passo": 3,
                "titulo": "Ingestão e Efeito Dominó",
                "descricao": "A barata come o gel, retorna ao abrigo e morre. As outras baratas do ninho devoram o corpo contaminado e morrem sucessivamente.",
                "dica_do_aplicador": "Em infestações pesadas de francesinha, cheque após 7 dias e reponha os pontos consumidos."
            },
            {
                "passo": 4,
                "titulo": "Conservação da Seringa",
                "descricao": "Tampe a seringa para o gel não ressecar. A durabilidade do gel aplicado no ambiente chega a 90 dias.",
                "alerta": "Mantenha fora do alcance de crianças e animais de estimação."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "Primeiras Horas",
                "titulo": "Atração Noturna",
                "descricao": "Baratas saem à noite e ingerem o gel de alta palatabilidade.",
                "icone": "🪳"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Morte no Esconderijo",
                "descricao": "Baratas contaminadas morrem dentro das frestas do ninho.",
                "icone": "⚡"
            },
            {
                "periodo": "48 a 72 Horas",
                "titulo": "Contaminação Secundária",
                "descricao": "Ninfas e outras baratas morrem por canibalismo e coprofagia.",
                "icone": "💥"
            },
            {
                "periodo": "7 a 10 Dias",
                "titulo": "Cozinha Limpa",
                "descricao": "Extermínio completo da infestação de baratinhas francesinhas.",
                "icone": "✨"
            }
        ]
    }
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
    "rendimento": "Trata até 50 m² de área de formigueiro.",
    "destaque": true,
    "preco_base": 9.99,
    "manual_aplicacao": {
        "resumo_aplicador": "1ª Isca Granulada com Etiprole do mercado brasileiro para controle de formigas cortadeiras (Saúvas e Quenquéns). Carregamento imediato para dentro das câmaras do formigueiro.",
        "checklist_previo": [
            "Princípio Ativo Inovador: Etiprole — alta atratividade e carregamento instantâneo sem rejeição.",
            "Alvos: Formigas cortadeiras de folhas (Saúvas e Quenquéns).",
            "REGRA DE OURO ABSOLUTA: NUNCA pegue a isca com as mãos desnudas! O suor humano impregna odor que faz as formigas rejeitarem a isca.",
            "Aplicação ao lado da trilha: NUNCA jogue os grânulos dentro do buraco (olheiro), pois a formiga rejeita se a entrada for obstruída."
        ],
        "equipamentos": [
            "Sachê aplicador com bico dosador ou luvas limpas de borracha",
            "Porta-iscas de cano PVC ou telhas (se houver risco de chuva)",
            "Tesoura para cortar a ponta do sachê"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Aplicação por Olheiro Ativo",
                "dose": "5g a 10g despejados ao lado da trilha ativa",
                "cobertura": "Trata ninhos individuais de saúvas e quenquéns"
            },
            "area_total": {
                "titulo": "Sachê Todo (50g)",
                "dose": "50g distribuídos ao longo das trilhas principais",
                "cobertura": "Elimina formigueiros médios a grandes"
            },
            "instrucao_diluicao": "ISCA GRANULADA PRONTA USO. NUNCA misturar com água ou outros defensivos."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Mapeamento das Trilhas Ativas",
                "descricao": "Caminhe pelo terreno no final da tarde e localize a trilha onde as formigas estão cortando e carregando folhas ativamente.",
                "dica_do_aplicador": "Aplique em dias secos. Não aplique com previsão de chuva ou sobre solo muito molhado."
            },
            {
                "passo": 2,
                "titulo": "Corte do Sachê sem Tocar na Isca",
                "descricao": "Corte a quina da embalagem com uma tesoura limpa. Despeje os grânulos diretamente da embalagem no chão.",
                "alerta": "NUNCA toque nos grânulos com os dedos desprotegidos!"
            },
            {
                "passo": 3,
                "titulo": "Posicionamento ao Lado da Trilha",
                "descricao": "Deposite pequenos montinhos de isca a cerca de 20cm ao lado da trilha por onde as formigas caminham.",
                "dica_do_aplicador": "As operárias trocam imediatamente a folha pelo grânulo de Etiprole e o carregam para o ninho."
            },
            {
                "passo": 4,
                "titulo": "Ação no Jardim de Fungo",
                "descricao": "No interior do ninho, o Etiprole contamina a câmara do fungo simbiótico e as operárias, matando a colônia por completo.",
                "alerta": "Se sobrar isca no sachê, dobre a ponta e vede com fita adesiva para manter o aroma fresco."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "30 Minutos",
                "titulo": "Carregamento Rápido",
                "descricao": "Formigas abandonam as folhas e levam toda a isca para o olheiro.",
                "icone": "🐜"
            },
            {
                "periodo": "24 Horas",
                "titulo": "Armazenamento no Ninho",
                "descricao": "A isca é incorporada às câmaras subterrâneas de fungo.",
                "icone": "📦"
            },
            {
                "periodo": "3 a 5 Dias",
                "titulo": "Paralisação dos Cortes",
                "descricao": "As plantas do jardim param de ser cortadas e desfolhadas.",
                "icone": "🌱"
            },
            {
                "periodo": "7 a 14 Dias",
                "titulo": "Morte do Formigueiro",
                "descricao": "Eliminação definitiva da rainha e esgotamento total do ninho.",
                "icone": "🛑"
            }
        ]
    }
  },
  {
    "id": 25,
    "nome": "Ki-Rato Soft-Bait Isca Macia (200g e 2kg)",
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
      "Sachê 200g e Balde 2kg"
    ],
    "imagens": [
      "img/produtos/p25-k-rato-soft-bait.webp"
    ],
    "unidade": "un",
    "referencia": "KRATO-SOFT-150-2K",
    "rendimento": "Trata até 200 m² de área perimetral.",
    "destaque": true,
    "preco_base": 21.93,
    "manual_aplicacao": {
        "resumo_aplicador": "Isca fresca macia de dose única formulada com GORDURA DE QUEIJO. Palatabilidade e atratividade máximas para ratos de esgoto, ratos de telhado e camundongos resistentes a outras iscas.",
        "checklist_previo": [
            "Diferencial único: Gordura de Queijo autêntica na formulação — vence a competição alimentar mesmo em locais com fartura de ração ou comida.",
            "Dose única anticoagulante: Basta o roedor consumir uma única porção para ingerir a dose letal.",
            "Modo sachê: NÃO abrir o saquinho plástico individual; o roedor rói a embalagem porosa atraído pelo cheiro.",
            "Segurança: Deve ser colocado sempre dentro de porta-iscas com chave, tubos de PVC ou locais inacessíveis a cães e gatos."
        ],
        "equipamentos": [
            "Porta-iscas com chave ou pedaços de tubo de PVC de 75mm a 100mm",
            "Luvas descartáveis (para não passar cheiro de mão humana na isca)",
            "Arame ou prego para fixar o sachê dentro da caixa"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Pontos de Iscagem (Camundongos)",
                "dose": "1 a 2 sachês (10g a 20g) por ponto a cada 2 a 3 metros",
                "cobertura": "Trata forros, despensas e garagens"
            },
            "area_total": {
                "titulo": "Pontos para Ratos de Esgoto e Telhado",
                "dose": "2 a 4 sachês por porta-isca a cada 5 a 10 metros",
                "cobertura": "Embalagem 150g trata perímetro de galpões e quintais"
            },
            "instrucao_diluicao": "ISCA PRONTA USO. NUNCA abrir os saquinhos de papel permeável."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Identificação das Trilhas e Fezes",
                "descricao": "Ratos caminham colados em rodapés, muros e tubulações. Procure marcas de gordura escura nas paredes e fezes.",
                "dica_do_aplicador": "Use luvas descartáveis ao manusear a isca para não transferir odor de suor humano, o que gera desconfiança no rato."
            },
            {
                "passo": 2,
                "titulo": "Fixação nos Porta-Iscas",
                "descricao": "Coloque os sachês dentro do porta-iscas preso na haste de arame. Isso impede que o roedor arraste o veneno para o meio do quintal.",
                "alerta": "NUNCA deixe o sachê solto no chão onde cães possam comer."
            },
            {
                "passo": 3,
                "titulo": "Posicionamento Estratégico",
                "descricao": "Instale as caixas encostadas na parede, nas trilhas de passagem, perto de entulhos e ralos de esgoto.",
                "dica_do_aplicador": "Para ratos de telhado, posicione as caixas em vigas no sótão ou forro."
            },
            {
                "passo": 4,
                "titulo": "Inspeção e Reposição",
                "descricao": "Verifique os pontos após 3 e 7 dias. Se os sachês forem consumidos, reponha novos até que cessem as mordidas.",
                "alerta": "O roedor morre dessecado em até 4 a 7 dias após a ingestão, minimizando mau cheiro."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "1 a 2 Dias",
                "titulo": "Atração e Consumo",
                "descricao": "Roedores descobrem a isca com queijo e consomem a dose letal.",
                "icone": "🧀"
            },
            {
                "periodo": "3 a 5 Dias",
                "titulo": "Ação Anticoagulante",
                "descricao": "O ativo age sem causar dor imediata, evitando que outros ratos desconfiem.",
                "icone": "🐀"
            },
            {
                "periodo": "5 a 7 Dias",
                "titulo": "Morte e Dessecação",
                "descricao": "Morte do roedor na toca com dessecação corporal sem odor forte.",
                "icone": "🛑"
            },
            {
                "periodo": "15 Dias",
                "titulo": "Ambiente Desratizado",
                "descricao": "Erradicação dos roedores e fim dos barulhos em forros.",
                "icone": "✨"
            }
        ]
    }
  },
  {
    "id": 26,
    "nome": "K-Rato Raticida Pó de Contato (100g e 250g)",
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
    "rendimento": "Trata até 25 metros lineares de trilhas ou tocas.",
    "destaque": false,
    "preco_base": 160.11,
    "manual_aplicacao": {
        "resumo_aplicador": "Raticida anticoagulante em pó fino aderente para aplicação em tocas, conduítes, forros e frestas. O roedor caminha, o pó gruda nos pelos e patas e é ingerido durante a autolimpeza.",
        "checklist_previo": [
            "Mecanismo de autolimpeza: Ratos têm o hábito instintivo de se lamber diariamente; ao limpar patas e pelos, ingerem a dose letal.",
            "Excelente para locais onde ratos refugam iscas com comida (armazéns de grãos, forros e tubulações).",
            "Não solúvel em água: Resiste à umidade de galerias e tocas.",
            "Talqueira aplicadora prática: Frascos com bico polvilhador."
        ],
        "equipamentos": [
            "Frasco com bico polvilhador (talqueira inclusa)",
            "Luvas de proteção impermeáveis",
            "Máscara protetora contra poeira e óculos",
            "Lanterna para inspecionar tocas"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Aplicação em Tocas e Buracos",
                "dose": "Polvilhar 20g a 40g diretamente na entrada da toca",
                "cobertura": "Trata furos de ratos de esgoto no quintal"
            },
            "area_total": {
                "titulo": "Aplicação por Metro Linear",
                "dose": "40g por metro linear em faixas de 5 a 10cm de largura",
                "cobertura": "Frasco de 1kg cobre até 25 metros lineares de trilhas intensas"
            },
            "instrucao_diluicao": "PÓ SECO PRONTO USO. NUNCA misturar com água."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Identificação das Entradas e Passagens",
                "descricao": "Localize buracos de terra batida (tocas ativas), conduítes elétricos desativados, frestas sob estrados e cantos de forros.",
                "dica_do_aplicador": "Tocas ativas têm a borda lisa e livre de teias de aranha."
            },
            {
                "passo": 2,
                "titulo": "Polvilhamento com a Talqueira",
                "descricao": "Aperte o frasco polvilhador espalhando uma camada uniforme de pó (40g por metro linear) na entrada da toca ou ao longo da trilha.",
                "alerta": "NÃO aplique em locais onde pessoas pisem ou onde o vento possa espalhar o pó sobre alimentos."
            },
            {
                "passo": 3,
                "titulo": "Adesão aos Pelos e Ingestão",
                "descricao": "Ao entrar ou sair da toca, o roedor passa pelo pó, que adere firmemente à pelagem e às patas. Na toca, o rato se lambe e ingere o anticoagulante.",
                "dica_do_aplicador": "O roedor leva o pó nos pelos para dentro da ninhada, contaminando também os filhotes."
            },
            {
                "passo": 4,
                "titulo": "Monitoramento e Fechamento da Toca",
                "descricao": "Após 7 dias, feche a boca da toca com terra e cimento. Se não for reaberta, a colônia foi exterminada.",
                "alerta": "Use máscara durante a aplicação para evitar inalar partículas de pó."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "Primeira Noite",
                "titulo": "Contato e Adesão",
                "descricao": "O rato transita pela faixa e fica com pelos impregnados.",
                "icone": "🐾"
            },
            {
                "periodo": "24 a 48 Horas",
                "titulo": "Ingestão por Limpeza",
                "descricao": "Ao se lamber, o animal consome a dose sem desconfiar.",
                "icone": "👅"
            },
            {
                "periodo": "4 a 6 Dias",
                "titulo": "Ação Anticoagulante",
                "descricao": "Morte do roedor e contaminação cruzada na ninhada.",
                "icone": "🛑"
            },
            {
                "periodo": "10 Dias",
                "titulo": "Tocas Inativas",
                "descricao": "Fim definitivo da movimentação de roedores na área.",
                "icone": "✨"
            }
        ]
    }
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
    "rendimento": "Trata até 10 m² de canteiros e jardins.",
    "destaque": true,
    "preco_base": 5.88,
    "manual_aplicacao": {
        "resumo_aplicador": "Isca granulada lesmicida registrada para Jardinagem Amadora. Grânulos com Bórax de alta resistência à chuva e umidade, eliminando lesmas e caramujos de canteiros e vasos.",
        "checklist_previo": [
            "1ª Isca com Bórax registrada para jardinagem: Segura e de alta atratividade.",
            "Resistência à água: Não desmancha com a primeira rega ou orvalho noturno.",
            "Hábito noturno dos moluscos: Aplicação OBRIGATÓRIA no final da tarde ou início da noite.",
            "Alvos: Lesmas, caracóis e caramujos de horta e jardim."
        ],
        "equipamentos": [
            "Sachê aplicador com grânulos",
            "Luvas de procedimento simples"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Aplicação em Canteiros e Floreiras",
                "dose": "Espalhar 4g por metro quadrado",
                "cobertura": "Sachê de 30g cobre cerca de 7 a 8 m² de canteiro"
            },
            "area_total": {
                "titulo": "Proteção Perimetral de Jardins",
                "dose": "Distribuir pequenos montinhos em volta de plantas atacadas",
                "cobertura": "Protege até 20 vasos e canteiros ornamentais"
            },
            "instrucao_diluicao": "ISCA GRANULADA PRONTA USO. Espalhar os grânulos a seco no solo."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Irrigação Prévia do Solo",
                "descricao": "Regue levemente o canteiro no final da tarde. A umidade atrai as lesmas para fora dos esconderijos.",
                "dica_do_aplicador": "Lesmas e caracóis odeiam o calor do dia e só saem da terra ao anoitecer."
            },
            {
                "passo": 2,
                "titulo": "Espalhar no Final da Tarde (Após as 17h)",
                "descricao": "Espalhe cerca de 4g por m² sobre o solo ao redor das plantas atacadas (orquídeas, hortaliças, folhagens).",
                "alerta": "Não jogue montes grandes concentrados; espalhe uniformemente para maior atratividade."
            },
            {
                "passo": 3,
                "titulo": "Atração e Desidratação",
                "descricao": "Os moluscos são atraídos pelos grânulos, alimentam-se e sofrem rápida perda de umidade e paralisação.",
                "dica_do_aplicador": "Coloque uma faixa protetora ao redor da base de vasos suspensos."
            },
            {
                "passo": 4,
                "titulo": "Limpeza dos Resíduos",
                "descricao": "No dia seguinte, recolha os moluscos mortos e descarte.",
                "alerta": "Manter longe do alcance de animais domésticos."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "Primeira Noite",
                "titulo": "Atração Noturna",
                "descricao": "Lesmas e caracóis consomem a isca ao saírem dos abrigos.",
                "icone": "🐌"
            },
            {
                "periodo": "12 Horas",
                "titulo": "Paralisação e Morte",
                "descricao": "Desidratação do molusco com perda de secreção mucosa.",
                "icone": "⚡"
            },
            {
                "periodo": "48 Horas",
                "titulo": "Canteiros Livres",
                "descricao": "Fim da destruição de brotos novos e folhas mastigadas.",
                "icone": "🌱"
            },
            {
                "periodo": "15 Dias",
                "titulo": "Resistência Residual",
                "descricao": "Grânulos permanecem ativos no solo resistindo a regas.",
                "icone": "🛡️"
            }
        ]
    }
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
    "rendimento": "Trata de 40 m² a 200 m² de área perimetral.",
    "destaque": false,
    "preco_base": 38.20,
    "manual_aplicacao": {
        "resumo_aplicador": "Isca granulada em pellets à base de Metaldeído para controle severo em grandes áreas e combate ao Caramujo Africano (Achatina fulica). Pellets com alta durabilidade externa.",
        "checklist_previo": [
            "Especialista em Caramujo Africano (Achatina fulica): Espécie invasora transmissora de zoonoses.",
            "Grandes ambientes: Quintais amplos, sítios, terrenos baldios e áreas verdes extensas.",
            "Pellets extrusados duros: Resistência máxima a chuvas e intempéries sem dissolver.",
            "Aplicação noturna recomendada."
        ],
        "equipamentos": [
            "Luvas de borracha obrigatórias para manuseio",
            "Colher dosadora exclusiva",
            "Sacos plásticos resistentes para descarte de conchas"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Aplicação por Ponto Crítico",
                "dose": "5g a 10g de pellets espalhados em áreas sombreadas",
                "cobertura": "Trata cantos de muros e sob folhagens úmidas"
            },
            "area_total": {
                "titulo": "Embalagem 200g ou 1kg",
                "dose": "Espalhar 5g por metro quadrado ao redor da propriedade",
                "cobertura": "200g cobrem até 40 m²; 1kg cobre até 200 m² de perímetro"
            },
            "instrucao_diluicao": "ISCA EM PELLETS PRONTA USO. Não molhar no momento da aplicação."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Identificação dos Abrigos de Caramujos",
                "descricao": "Procure sob folhas secas, pedras, entulhos e cantos úmidos de muros onde o caramujo africano repousa durante o dia.",
                "alerta": "NUNCA pegue caramujos africanos com as mãos sem luvas impermeáveis."
            },
            {
                "passo": 2,
                "titulo": "Distribuição dos Pellets no Entardecer",
                "descricao": "Espalhe os pellets de Metaldeído ao redor das áreas de infestação no final do dia.",
                "dica_do_aplicador": "Forme uma barreira contínua de grânulos ao longo do muro para impedir a entrada de novos moluscos."
            },
            {
                "passo": 3,
                "titulo": "Ação Letal por Ingestão e Contato",
                "descricao": "O metaldeído destrói as células secretoras de muco do molusco, causando desidratação maciça e morte rápida.",
                "dica_do_aplicador": "Mesmo em dias chuvosos, os pellets mantêm a forma e a atratividade química."
            },
            {
                "passo": 4,
                "titulo": "Coleta e Descarte Seguro das Conchas",
                "descricao": "Recolha os caramujos mortos com luvas ou pás, coloque em saco resistente e aplique cal virgem antes de fechar e descartar.",
                "alerta": "Mantenha cães e animais longe da área onde a isca estiver espalhada."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "Primeira Noite",
                "titulo": "Atração Massiva",
                "descricao": "Caramujos africanos se alimentam dos pellets atraentes.",
                "icone": "🐌"
            },
            {
                "periodo": "12 a 24 Horas",
                "titulo": "Morte por Desidratação",
                "descricao": "Eliminação rápida com liberação excessiva de muco e morte.",
                "icone": "🛑"
            },
            {
                "periodo": "3 a 5 Dias",
                "titulo": "Limpeza de População",
                "descricao": "Queda drástica no número de moluscos vivos no terreno.",
                "icone": "📉"
            },
            {
                "periodo": "30 Dias",
                "titulo": "Proteção Perimetral",
                "descricao": "Barreira ativa impedindo o retorno dos caramujos.",
                "icone": "🛡️"
            }
        ]
    }
  },
  {
    "id": 29,
    "nome": "Koral Carrapatos e Pulgas (30ml e 60ml)",
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
      "Frasco de 30 ou 60ml (Caixa c/ 60 frascos)"
    ],
    "imagens": [
      "img/produtos/p29-koral-carrapatos-pulgas-60ml.webp"
    ],
    "unidade": "frasco",
    "referencia": "KOR-CARR-60",
    "rendimento": "Rende até 600 m² de calda de pulverização.",
    "destaque": true,
    "preco_base": 37.36,
    "manual_aplicacao": {
        "resumo_aplicador": "Inseticida e acaricida concentrado de ação completa contra Carrapatos e Pulgas. Fórmula de quebra total do ciclo: Adulticida, Ovicida e Larvicida (elimina ovos, larvas, ninfas e adultos).",
        "checklist_previo": [
            "Ação nas 4 fases biológicas: Mata o carrapato adulto e impede a eclosão de ovos e larvas no solo.",
            "Destino: Canis, casinhas, muros, rodapés, frestas de alvenaria e gramados onde animais circulam.",
            "NÃO aplicar diretamente sobre o corpo do animal (é defensivo ambiental para o recinto).",
            "Segurança: Animais podem retornar livremente após a secagem completa da calda (2 horas)."
        ],
        "equipamentos": [
            "Pulverizador costal ou manual limpo",
            "Dosador graduado de 3ml",
            "Luvas e máscara de proteção"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Preparo de 1 Litro de Calda",
                "dose": "Diluir 3ml por litro de água limpa",
                "cobertura": "Trata cerca de 25 a 30 m² de área de canil e rodapés"
            },
            "area_total": {
                "titulo": "Frasco Todo (60ml)",
                "dose": "60ml em 20 litros de água",
                "cobertura": "Trata até 500 a 600 m² de quintal e áreas frequentadas por cães"
            },
            "instrucao_diluicao": "Meça 3ml de Koral Carrapatos para cada 1 litro de água limpa, agite bem no pulverizador até homogeneizar."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Retirada Prévia dos Animais",
                "descricao": "Leve os cães e gatos para outra área segura durante a aplicação.",
                "dica_do_aplicador": "Retire também tigelas de ração e potes de água antes de iniciar."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o preparo da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Use máscara durante a manipulação para evitar inalação da névoa."
            },
            {
                "passo": 3,
                "titulo": "Pulverização em Todas as Superfícies",
                "descricao": "Carrapatos sobem em muros e frestas; pulverize o chão, rodapés e as paredes até 1,5 metro de altura.",
                "dica_do_aplicador": "Pulverize a grama e a terra batida onde os animais deitam."
            },
            {
                "passo": 4,
                "titulo": "Secagem e Retorno dos Pets",
                "descricao": "Aguarde cerca de 2 horas até que todas as superfícies estejam completamente secas ao toque.",
                "alerta": "Após secar, a calda fica inofensiva para cães e gatos, mantendo o poder residual contra carrapatos e pulgas."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "30 Minutos",
                "titulo": "Choque em Adultos",
                "descricao": "Carrapatos e pulgas em circulação sofrem paralisação imediata.",
                "icone": "⚡"
            },
            {
                "periodo": "2 Horas",
                "titulo": "Secagem e Reentrada",
                "descricao": "Calda seca; cães e gatos liberados para voltar ao canil.",
                "icone": "🐕"
            },
            {
                "periodo": "24 a 48 Horas",
                "titulo": "Ação Ovicida e Larvicida",
                "descricao": "Ovos e larvas ocultos nas frestas são inviabilizados.",
                "icone": "🛑"
            },
            {
                "periodo": "Até 90 Dias",
                "titulo": "Proteção Residual",
                "descricao": "Ambiente desinfestado e protegido contra novas infestações.",
                "icone": "✨"
            }
        ]
    }
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
    "rendimento": "Trata até 30 m² de área aplicada ou 20 casinhas de pet.",
    "destaque": false,
    "preco_base": 13.50,
    "manual_aplicacao": {
        "resumo_aplicador": "Spray pronto para uso imediato com aplicador em gatilho para combate localizado de carrapatos e pulgas em rodapés, frestas, casinhas de animais, tapetes e estrados.",
        "checklist_previo": [
            "Pronto uso: Sem preparo de caldas ou equipamentos pesados.",
            "Aplicação pontual: Ideal para casinhas plásticas ou de madeira de cães, rodapés e fendas de sofá.",
            "Quebra de ciclo: Ação adulticida, larvicida e ovicida.",
            "Seguro após secar: Liberar o animal após a secagem da casinha."
        ],
        "equipamentos": [
            "Frasco spray original de 240ml com gatilho",
            "Pano para secar excessos"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Higienização de Casinha de Pet",
                "dose": "5 a 10 borrifadas no interior e fendas da casinha",
                "cobertura": "Trata 1 casinha média completa"
            },
            "area_total": {
                "titulo": "Frasco Todo (240ml)",
                "dose": "Uso puro direto",
                "cobertura": "Trata de 15 a 20 casinhas ou rodapés de 3 a 4 cômodos"
            },
            "instrucao_diluicao": "NÃO DILUIR. Já vem balanceado de fábrica para borrifação direta."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Remoção de Almofadas e Panos",
                "descricao": "Retire caminhas de tecido e lave-as em água quente. Retire o animal do local temporariamente.",
                "dica_do_aplicador": "Borrife o Koral Spray nas frestas internas e fendas da casinha plástica ou de madeira."
            },
            {
                "passo": 2,
                "titulo": "Aplicação nos Cantos e Rodapés",
                "descricao": "Borrife a 15-20cm ao longo dos rodapés, atrás de portas e sob móveis baixos onde pulgas se refugiam.",
                "alerta": "NÃO aplicar no animal; use produtos veterinários específicos no corpo do pet."
            },
            {
                "passo": 3,
                "titulo": "Secagem Completa",
                "descricao": "Deixe o ambiente ventilar e secar por 1 a 2 horas.",
                "dica_do_aplicador": "A fórmula não mancha pisos de cerâmica ou madeira tratada."
            },
            {
                "passo": 4,
                "titulo": "Retorno do Pet",
                "descricao": "Após a secagem total, coloque a caminha limpa e permita o retorno do cão ou gato.",
                "alerta": "Guarde o frasco em local seco e fora do alcance de crianças."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "15 Minutos",
                "titulo": "Ação de Contato",
                "descricao": "Pulgas e carrapatos em frestas morrem rapidamente.",
                "icone": "⚡"
            },
            {
                "periodo": "1 a 2 Horas",
                "titulo": "Secagem Rápida",
                "descricao": "Superfície seca; caminha e pet liberados.",
                "icone": "🐾"
            },
            {
                "periodo": "48 Horas",
                "titulo": "Esterilização de Ovos",
                "descricao": "Ovos de pulga no piso perdem viabilidade.",
                "icone": "🛑"
            },
            {
                "periodo": "30 Dias",
                "titulo": "Ambiente Protegido",
                "descricao": "Prevenção ativa contra proliferação no dormitório do pet.",
                "icone": "✨"
            }
        ]
    }
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
    "rendimento": "Condiciona até 100 litros de calda de pulverização.",
    "destaque": false,
    "preco_base": 12.12,
    "emEstoque":false,
    "manual_aplicacao": {
        "resumo_aplicador": "Condicionador e corretor de calda essencial para águas de poço artesiano e águas duras. Neutraliza cátions livres de cálcio e magnésio e ajusta o pH para ~5,5, impedindo a degradação dos defensivos.",
        "checklist_previo": [
            "Problema comum no campo: Água dura de poço tem excesso de cálcio e pH alcalino que 'corta' o efeito de herbicidas e inseticidas.",
            "Função sequestrante: Aprisiona o cálcio e magnésio, permitindo que 100% do princípio ativo atue na praga.",
            "pH ideal: Ajusta o pH da água para a faixa ótima de ~5,5 (levemente ácida), perfeita para a calda.",
            "REGRA DE OURO: Adicionar SEMPRE PRIMEIRO no tanque, antes de qualquer outro veneno ou defensivo!"
        ],
        "equipamentos": [
            "Pulverizador costal ou tanque de pulverização",
            "Medidor graduado de 2ml por litro",
            "Fita de teste de pH (opcional, para conferência)"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Dose por Litro de Água de Poço",
                "dose": "Adicionar 2ml por litro de água",
                "cobertura": "Exemplo: 4ml em pulverizador manual de 2 Litros"
            },
            "area_total": {
                "titulo": "Frasco Todo (100ml) em Tanque Costal",
                "dose": "100ml condiciona 50 litros de água dura",
                "cobertura": "Trata até 2,5 a 3 tanques costais de 20 Litros"
            },
            "instrucao_diluicao": "PRIMEIRO PASSO: Coloque a água no tanque, adicione 2ml/L do Redutor de pH, agite e AGUARDE 5 MINUTOS. DEPOIS adicione o herbicida ou inseticida escolhido."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Abastecer o Tanque com Água",
                "descricao": "Coloque a água do poço ou da torneira no tanque do pulverizador.",
                "dica_do_aplicador": "Se você nota que seus venenos demoram para funcionar ou precisam de dose dobrada, a causa quase sempre é a água dura."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A diluição e o condicionamento da calda devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "NUNCA coloque o defensivo antes do redutor; o redutor precisa agir na água primeiro."
            },
            {
                "passo": 3,
                "titulo": "Tempo de Descanso de 5 Minutos",
                "descricao": "Agite a calda e aguarde 5 minutos de repouso. Esse tempo é necessário para a reação química de quelação dos minerais pesados e redução do pH para ~5,5.",
                "dica_do_aplicador": "Após 5 minutos, a água estará quimicamente 'mole' e pronta para receber o defensivo."
            },
            {
                "passo": 4,
                "titulo": "Adição do Defensivo Escolhido",
                "descricao": "Agora adicione o Kapina, Roçada, Katana ou inseticida na dosagem normal do rótulo e aplique com rendimento potencializado em até 100%.",
                "alerta": "Feche bem a embalagem do redutor após o uso."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "1 Minuto",
                "titulo": "Quelação Química",
                "descricao": "Captura de íons de cálcio e magnésio na água.",
                "icone": "🧪"
            },
            {
                "periodo": "5 Minutos",
                "titulo": "Equilíbrio de pH ~5,5",
                "descricao": "Água estabilizada na faixa ideal de acidez estomática.",
                "icone": "⚖️"
            },
            {
                "periodo": "Na Mistura",
                "titulo": "Proteção da Molécula",
                "descricao": "O princípio ativo do defensivo não sofre hidrólise nem precipitação.",
                "icone": "🛡️"
            },
            {
                "periodo": "Na Aplicação",
                "titulo": "Eficácia Máxima no Alvo",
                "descricao": "Absorção até 2x mais rápida pela folhagem das invasoras.",
                "icone": "🚀"
            }
        ]
    }
  },
  {
    "id": 32,
    "nome": "Óleo Mineral e Dispersante Parafinado (100ml)",
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
    "rendimento": "Condiciona até 100 litros de calda de pulverização.",
    "destaque": true,
    "preco_base": 26.52,
    "manual_aplicacao": {
        "resumo_aplicador": "Adjuvante multifuncional 4 em 1 (Fixador, Emulsificante, Dispersante e Potencializador). Formulado com óleo mineral de grau parafinado puro para quebrar a tensão superficial e impedir evaporação da calda.",
        "checklist_previo": [
            "Ação 4 em 1: Fixa a gota na folha, espalha uniformemente, impede evaporação em dias secos e potencializa a absorção.",
            "Redução de deriva: Gotas mais pesadas e calibradas que não são levadas pelo vento.",
            "Compatibilidade ampla: Pode ser misturado com herbicidas, fungicidas e inseticidas.",
            "Dose econômica: Apenas 1ml por litro de calda pronta."
        ],
        "equipamentos": [
            "Pulverizador costal ou manual",
            "Seringa dosadora para medir 1ml por litro",
            "Água limpa"
        ],
        "dosagem": {
            "pequena_area": {
                "titulo": "Dose por Litro de Calda",
                "dose": "1ml por litro de água",
                "cobertura": "Exemplo: 5ml em tanque de 5 Litros de calda"
            },
            "area_total": {
                "titulo": "Frasco Todo (100ml)",
                "dose": "100ml condiciona 100 litros de calda de pulverização",
                "cobertura": "Trata até 5 tanques costais de 20 Litros"
            },
            "instrucao_diluicao": "Após preparar a calda com a água e o defensivo, adicione 1ml de Óleo Mineral Parafinado por litro, agite bem até formar emulsão homogênea."
        },
        "passos": [
            {
                "passo": 1,
                "titulo": "Preparo da Calda Principal",
                "descricao": "Coloque a água no tanque e misture o defensivo (herbicida ou fungicida) conforme a receita padrão.",
                "dica_do_aplicador": "O óleo mineral deve ser o último componente a entrar no tanque."
            },
            {
                "passo": 2,
                "titulo": "Preparo Conforme a Bula",
                "descricao": "A adição e o preparo da calda com adjuvante devem seguir estritamente as instruções contidas no rótulo/bula do produto ou a orientação direta da equipe técnica autorizada.",
                "alerta": "Não exceda a dose recomendada na bula para não provocar fitotoxidez sob sol forte."
            },
            {
                "passo": 3,
                "titulo": "Agitação e Emulsão",
                "descricao": "Agite o pulverizador vigorosamente. O óleo dispersa na calda, criando gotas de pulverização mais pesadas e aderentes.",
                "dica_do_aplicador": "A gota não escorre nem 'bate e pula' da folha; ela se espalha como uma película contínua."
            },
            {
                "passo": 4,
                "titulo": "Pulverização de Alta Eficiência",
                "descricao": "Pulverize normalmente. As plantas absorverão o veneno com muito mais rapidez e resistência a chuvas precoces.",
                "alerta": "Lave o tanque com água e sabão após o uso para remover resíduos oleosos."
            }
        ],
        "linha_do_tempo": [
            {
                "periodo": "Na Aplicação",
                "titulo": "Quebra da Tensão da Gota",
                "descricao": "A gota se espalha cobrindo 3x mais área foliar sem pingar no chão.",
                "icone": "💧"
            },
            {
                "periodo": "30 Minutos",
                "titulo": "Anti-Evaporação",
                "descricao": "A camada de óleo impede que o sol evapore a calda antes da absorção.",
                "icone": "☀️"
            },
            {
                "periodo": "1 a 2 Horas",
                "titulo": "Fixação e Penetração",
                "descricao": "O óleo dissolve ceras cuticulares facilitando a entrada do defensivo.",
                "icone": "🌱"
            },
            {
                "periodo": "Pós-Chuva",
                "titulo": "Resistência à Lavagem",
                "descricao": "A calda fixada não é lavada por chuvas leves subsequentes.",
                "icone": "🌧️"
            }
        ]
    }
  },
  {
    "id": 33,
    "nome": "Pega Rato Krodec",
    "categoria": "raticidas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "Captura ratos com cola atóxica de alta aderência sem veneno",
    "para_que_serve": "Ratoeira adesiva dobrável para captura de ratos e camundongos em ambientes domésticos. Produto 100% atóxico e não poluente, ideal para uso seguro em casa sem risco para crianças e pets. Cola de longa duração com eficácia mantida por até 18 meses mesmo armazenada.",
    "como_age": "Conta com cola especial de altíssima aderência que imobiliza o roedor com segurança no momento do contato. Sem veneno, sem odor, sem substâncias nocivas — apenas a força da cola de alta performance Krodec que garante captura rápida e segura.",
    "como_usar": "Abra as partes lentamente para não perder a aderência da cola. Arme em formato 'L' (em canto de parede), dentro de tubos ou fixado diretamente no chão. Posicione SEMPRE encostado nas paredes, que são os trajetos mais usados pelos ratos. Descarte higienicamente após o uso.",
    "onde_nao_usar": "Evitar posicionar em áreas úmidas, pois a umidade pode comprometer a cola e reduzir a eficácia. Manter fora do alcance de crianças e animais de estimação.",
    "seguranca": {
      "pets": "Produto atóxico — sem risco de envenenamento. Manter fora do alcance de pets durante o uso. Após captura, descartar higienicamente sem contato direto com o animal.",
      "chuva": "Evitar locais úmidos ou expostos à umidade. A umidade pode comprometer a cola e reduzir a eficácia da captura.",
      "horario": "Posicionar à noite ou ao entardecer, horário de maior circulação de roedores. Verificar pela manhã.",
      "epi": "Usar luvas descartáveis ao manusear o produto após o uso. Descarte em saco plástico fechado sem necessidade de contato com o roedor."
    },
    "alvos": [
      "ratos",
      "camundongos",
      "ratazanas",
      "roedores",
      "mus musculus",
      "rattus norvegicus"
    ],
    "descricao": "Ratoeira adesiva atóxica com cola de alta performance e longa duração. Captura ratos e camundongos sem veneno, sem odor, com segurança e higiene.",
    "caracteristicas": [
      "100% Atóxico e não poluente",
      "Cola de alta aderência — dura até 18 meses",
      "Captura mais de um roedor por unidade",
      "Uso versátil: formato L, tubo ou solo",
      "Sem veneno, sem odor, fácil de descartar",
      "Indicado para uso doméstico"
    ],
    "imagens": [
      "img/produtos/p33-pega-rato-krodec.webp"
    ],
    "unidade": "unidade",
    "referencia": "KRODEC-PR-01",
    "rendimento": "Pode capturar mais de um roedor por armadilha.",
    "destaque": false,
    "preco_base": 3.99,
    "badge_texto": "Atóxico",
    "badge_tipo": "natural",
    "icones_representativos": ["🐀", "🪤", "🏠"],
    "manual_aplicacao": {
      "resumo_aplicador": "Ratoeira adesiva dobrável com cola atóxica de alta performance. Captura ratos e camundongos sem veneno, sem odor e sem bagunça. Posicione sempre encostada nas paredes, nos trajetos naturais dos roedores.",
      "checklist_previo": [
        "Identifique os sinais de infestação: fezes, roeduras em embalagens, trilhas oleosas nas paredes ou barulhos noturnos.",
        "Escolha o local ideal: sempre encostado nas paredes ou em cantos, que são os caminhos naturais dos ratos.",
        "Locais prioritários: atrás de móveis, em frestas, sob pias, em despensas e áreas de baixa luminosidade.",
        "Evite áreas úmidas: a umidade compromete a cola. Prefira ambientes secos e protegidos."
      ],
      "equipamentos": [
        "Luvas descartáveis para manuseio após o uso",
        "Saco plástico para descarte seguro",
        "Isca opcional (pedaço de pão, chocolate ou amendoim) para aumentar a atração"
      ],
      "dosagem": {
        "pequena_area": {
          "titulo": "Uso Pontual (1 ambiente)",
          "dose": "1 unidade por ponto de infestação",
          "cobertura": "1 armadilha por canto ou fresta identificada com sinais de roedores"
        },
        "area_total": {
          "titulo": "Infestação Moderada (vários cômodos)",
          "dose": "1 unidade a cada 3 a 5 metros ao longo das paredes",
          "cobertura": "Distribua pelas paredes de toda a área afetada para bloquear os trajetos"
        },
        "instrucao_diluicao": "Produto pronto para uso. Abra as partes lentamente para preservar a cola. Não é necessário nenhum preparo adicional."
      },
      "passos": [
        {
          "passo": 1,
          "titulo": "Abertura Cuidadosa da Armadilha",
          "descricao": "Abra as partes da ratoeira LENTAMENTE para evitar perda de aderência da cola. Não toque na superfície adesiva com as mãos para não reduzir o poder de fixação.",
          "dica_do_aplicador": "Se desejar, coloque um pequeno pedaço de isca (pão, chocolate ou amendoim) no centro da cola para aumentar a atração."
        },
        {
          "passo": 2,
          "titulo": "Posicionamento Estratégico",
          "descricao": "Arme em formato 'L' (encostada em canto de parede), dentro de tubos de PVC ou papelão, ou fixada diretamente no chão. SEMPRE encostada nas paredes — os ratos circulam principalmente pelos cantos e bordas dos ambientes.",
          "dica_do_aplicador": "Em locais com alta infestação, posicione duas unidades em paralelo para aumentar a área de cobertura."
        },
        {
          "passo": 3,
          "titulo": "Verificação e Monitoramento",
          "descricao": "Verifique as armadilhas pela manhã, pois os roedores são mais ativos à noite. Se não houver captura em 3 a 4 dias, mude o ponto de posicionamento para outro local com sinais de atividade.",
          "alerta": "Não movimente a armadilha com frequência após posicionada; os ratos desconfiam de mudanças no ambiente."
        },
        {
          "passo": 4,
          "titulo": "Descarte Seguro e Higiênico",
          "descricao": "Após a captura, feche a armadilha dobrando-a sobre o roedor (sem contato direto). Descarte em saco plástico fechado no lixo comum. Produto sem odor e sem veneno — descarte prático e seguro.",
          "alerta": "Use luvas descartáveis no manuseio pós-captura. Lave as mãos após o descarte."
        },
        {
          "passo": 5,
          "titulo": "Reposicionamento para Nova Captura",
          "descricao": "Posicione uma nova unidade no mesmo local se houver sinais de continuidade da infestação. Em infestações mais sérias, recomenda-se o uso conjunto com raticidas em isca para controle mais completo.",
          "dica_do_aplicador": "Combine com vedação de frestas e buracos de entrada para eliminar definitivamente o foco de infestação."
        }
      ],
      "linha_do_tempo": [
        {
          "periodo": "Na Colocação",
          "titulo": "Armadilha Pronta",
          "descricao": "Cola de alta aderência ativa imediatamente após abertura. Eficácia garantida por até 18 meses de armazenamento.",
          "icone": "🪤"
        },
        {
          "periodo": "1ª Noite",
          "titulo": "Período de Maior Atividade",
          "descricao": "Ratos e camundongos são mais ativos à noite. A armadilha posicionada nas paredes intercepta o trajeto natural do roedor.",
          "icone": "🌙"
        },
        {
          "periodo": "24 a 72 Horas",
          "titulo": "Captura Esperada",
          "descricao": "Em locais com sinais ativos de infestação, a captura ocorre em até 3 dias. Se não houver resultado, reposicione em outro ponto.",
          "icone": "🐀"
        },
        {
          "periodo": "Após a Captura",
          "titulo": "Descarte Fácil e Seguro",
          "descricao": "Feche, ensaque e descarte. Sem odor, sem veneno, sem contato com o animal. Coloque uma nova unidade para manter o controle.",
          "icone": "♻️"
        }
      ]
    }
  },
  {
    "id": 34,
    "nome": "Kromax Gel Mata Barata (10g)",
    "categoria": "formicidas-baratas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "Elimina baratas com isca em gel de Imidacloprid — ação rápida e efeito prolongado",
    "para_que_serve": "Inseticida em gel com isca altamente atrativa para combate a baratas urbanas, especialmente Blattella germânica (francesinha / paulistinha). Fórmula com Imidacloprid de ação rápida e efeito por semanas. Contém armagante para evitar ingestão acidental por humanos e pets.",
    "como_age": "A barata é atraída pela isca altamente palatável e, ao ingerir o gel, absorve o Imidacloprid que inicia o processo de intoxicação rapidamente, levando à morte progressiva. O efeito cascata pode eliminar outros indivíduos da colônia que entrem em contato com a barata intoxicada.",
    "como_usar": "Aplique pequenas gotas ou filetes próximo aos locais onde as baratas se escondem ou transitam: frestas, ralos, atrás de móveis, cantos escuros e soleiras. Não limpe ou remova o gel antes de 48 horas. Reaplique quando notar consumo da isca ou retorno da infestação.",
    "onde_nao_usar": "Não aplicar diretamente sobre alimentos, utensílios ou superfícies de preparo de alimentos. Não aplicar em locais úmidos que possam dissolver o gel antes da ação. Manter fora do alcance de crianças e pets.",
    "seguranca": {
      "pets": "Contém armagante — substância que inibe a ingestão acidental por animais. Mesmo assim, manter fora do alcance de crianças e pets. Aplicar em locais de difícil acesso para eles.",
      "chuva": "Evitar aplicação em locais úmidos ou expostos à água, pois a umidade pode diluir o gel e reduzir a eficácia da isca.",
      "horario": "Aplicar preferencialmente ao final da tarde ou à noite, horário de maior atividade das baratas. Não pertube a isca por pelo menos 48 horas após aplicação.",
      "epi": "Usar luvas durante a aplicação. Lavar as mãos após o manuseio. Evitar contato com olhos e mucosas. Armazenar em local seco, fresco e fora da luz solar direta."
    },
    "alvos": [
      "baratas",
      "blattella germanica",
      "francesinha",
      "paulistinha",
      "barata pequena",
      "barata de cozinha",
      "insetos rasteiros"
    ],
    "descricao": "Gel inseticida com Imidacloprid e armagante para eliminação rápida e segura de baratas urbanas. Ação prolongada por semanas. Bisnaga com 10g.",
    "caracteristicas": [
      "Ingrediente ativo Imidacloprid",
      "Fórmula atrativa — isca irresistível",
      "Contém armagante (segurança extra)",
      "Efeito prolongado por semanas",
      "Aplicação em gotas ou filetes",
      "Uso doméstico e profissional",
      "Bisnaga aplicadora com 10g"
    ],
    "imagens": [
      "img/produtos/p34-kromax-gel-mata-barata-10g.webp"
    ],
    "unidade": "bisnaga",
    "referencia": "KROMAX-GEL-10G",
    "rendimento": "1 bisnaga de 10g trata múltiplos pontos de infestação. Reaplique conforme consumo da isca.",
    "destaque": false,
    "preco_base": 7.98,
    "badge_texto": "Ação Rápida",
    "badge_tipo": "rapido",
    "icones_representativos": ["🪳", "🎯", "🏠"],
    "manual_aplicacao": {
      "resumo_aplicador": "Gel inseticida com Imidacloprid para eliminação de baratas urbanas (Blattella germânica, francesinha e paulistinha). Isca altamente atrativa com efeito prolongado por semanas. Contém armagante para segurança extra.",
      "checklist_previo": [
        "Identifique os focos: verifique frestas, ralos, atrás de geladeiras e fogões, soleiras de portas e cantos escuros — locais preferidos das baratas.",
        "Higienize o ambiente: remova restos de alimento e sujeira antes de aplicar para que a isca seja a única fonte de atração.",
        "Não use inseticida spray simultâneo: o spray repele as baratas e pode impedir que elas consumam o gel.",
        "Não remova o gel antes de 48 horas: o produto precisa de tempo para atrair e intoxicar as baratas."
      ],
      "equipamentos": [
        "A própria bisnaga aplicadora (produto pronto para uso)",
        "Luvas descartáveis para manuseio",
        "Palito ou espátula para aplicação em frestas muito estreitas (opcional)"
      ],
      "dosagem": {
        "pequena_area": {
          "titulo": "Aplicação Pontual (por ponto)",
          "dose": "Gotas de 0,1 a 0,3g por ponto de aplicação",
          "cobertura": "1 bisnaga de 10g rende de 30 a 100 pontos de aplicação dependendo do tamanho das gotas"
        },
        "area_total": {
          "titulo": "Tratamento de Ambiente (cozinha/banheiro)",
          "dose": "Aplique em todos os pontos críticos do ambiente: ralos, frestas, cantos e atrás de eletrodomésticos",
          "cobertura": "1 bisnaga trata completamente 1 a 2 ambientes infestados com múltiplos pontos"
        },
        "instrucao_diluicao": "Produto pronto para uso. Retire a tampa da bisnaga, encaixe o bico aplicador e pressione levemente para liberar gotas ou filetes no local desejado. Não diluir."
      },
      "passos": [
        {
          "passo": 1,
          "titulo": "Mapeamento dos Pontos Críticos",
          "descricao": "Identifique todos os locais com sinais de baratas: fezes (pontos escuros), odor característico, exúvias (peles) ou avistamento direto. Foque em frestas, ralos, rodapés, atrás de geladeiras, fogões e sob pias.",
          "dica_do_aplicador": "Iluminações noturnas revelam os trajetos reais das baratas — faça a vistoria à noite para mapear melhor os pontos de aplicação."
        },
        {
          "passo": 2,
          "titulo": "Aplicação do Gel em Gotas",
          "descricao": "Aplique pequenas gotas ou filetes diretamente nos pontos mapeados. O bico aplicador da bisnaga permite precisão em frestas e cantos estreitos. Não aplique em grandes quantidades — gotas pequenas e frequentes são mais eficazes.",
          "dica_do_aplicador": "Aplique o gel nas superfícies verticais (laterais de frestas, rodapés) para que as baratas passem por cima e ingiram o produto ao se limparem."
        },
        {
          "passo": 3,
          "titulo": "Período de Ação — Não Perturbe",
          "descricao": "Não limpe, não remova e não molhe o gel por pelo menos 48 horas. Esse é o período crítico de atração e intoxicação inicial das baratas. Evite também usar sprays ou outros inseticidas na área tratada.",
          "alerta": "O uso de sprays repelentes junto com o gel anula o efeito da isca, pois as baratas fogem e não consomem o produto."
        },
        {
          "passo": 4,
          "titulo": "Monitoramento e Reaplicação",
          "descricao": "Verifique os pontos de aplicação após 5 a 7 dias. Reaplique onde a isca estiver consumida ou ressecada. Em infestações severas, faça uma segunda aplicação completa após 15 dias para eliminar novas gerações.",
          "dica_do_aplicador": "A presença de baratas mortas próximas aos pontos de aplicação é sinal de que o produto está funcionando corretamente."
        }
      ],
      "linha_do_tempo": [
        {
          "periodo": "Imediato",
          "titulo": "Isca Ativada",
          "descricao": "O aroma atrativo do gel começa a agir imediatamente após a aplicação, atraindo as baratas para o ponto de isca.",
          "icone": "🎯"
        },
        {
          "periodo": "Minutos após ingestão",
          "titulo": "Intoxicação Rápida",
          "descricao": "O Imidacloprid começa a agir minutos após a ingestão, paralisando o sistema nervoso da barata e iniciando o processo de morte progressiva.",
          "icone": "⚡"
        },
        {
          "periodo": "48 a 72 Horas",
          "titulo": "Eliminação Ativa",
          "descricao": "Redução visível da infestação. Baratas mortas próximas aos pontos de isca confirmam a eficácia do tratamento.",
          "icone": "🪳"
        },
        {
          "periodo": "Semanas",
          "titulo": "Proteção Prolongada",
          "descricao": "O gel mantém sua eficácia por semanas no local de aplicação. Reaplique apenas quando a isca estiver totalmente consumida ou a infestação retornar.",
          "icone": "🛡️"
        }
      ]
    }
  },
  {
    "id": 35,
    "nome": "Kromax Gel Mata Formiga (10g)",
    "categoria": "formicidas-baratas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "Elimina toda a colônia de formigas — da operária à rainha — com Hidrametilnona",
    "para_que_serve": "Inseticida em gel com isca altamente atrativa para formigas doceiras. A fórmula com Hidrametilnona de ação lenta permite que as operárias consumam e transportem o produto até o ninho, eliminando a colônia de dentro para fora — incluindo a rainha. Contém armagante para uso seguro em ambientes domésticos e profissionais.",
    "como_age": "A ação lenta da Hidrametilnona é proposital: as formigas operárias não morrem imediatamente, o que lhes permite carregar o gel até o interior da colônia e compartilhá-lo com a rainha e demais indivíduos. O resultado é a extinção total da infestação, de dentro para fora, sem alarmar a colônia.",
    "como_usar": "Aplique pequenas gotas ou filetes um pouco acima ou abaixo dos locais onde as formigas transitam. Priorize frestas, fendas, rachaduras, atrás e embaixo de móveis, pias, armários e rodapés. Aguarde a ação sem remover o gel nas primeiras 48 horas. Pode ser usado em áreas externas desde que protegidas da chuva e umidade.",
    "onde_nao_usar": "Não aplicar diretamente sobre alimentos, utensílios ou superfícies de preparo. Evitar locais expostos à chuva ou umidade intensa. Manter fora do alcance de crianças e pets.",
    "seguranca": {
      "pets": "Contém armagante — substância que reduz o risco de ingestão acidental por animais. Mesmo assim, aplicar em locais fora do alcance de crianças e pets. Produto sem odor, discreto e seguro quando usado conforme as instruções.",
      "chuva": "Evitar aplicação em locais expostos à chuva ou umidade. Em áreas externas, aplicar apenas em pontos protegidos (sob pedras, dentro de frestas cobertas, etc.).",
      "horario": "Aplicar ao final do dia ou à noite, quando as formigas estão mais ativas no carregamento de alimentos. Não perturbe o gel por pelo menos 48 horas.",
      "epi": "Usar luvas durante a aplicação. Lavar as mãos após o manuseio. Evitar contato com olhos e mucosas. Armazenar em local seco, fresco e fora da luz solar direta."
    },
    "alvos": [
      "formigas",
      "formigas doceiras",
      "formigas lava-pé",
      "formigas de cozinha",
      "formigas pretas pequenas",
      "colônia de formigas",
      "formigueiro"
    ],
    "descricao": "Gel inseticida com Hidrametilnona de ação lenta para eliminação completa de colônias de formigas doceiras. As operárias levam o produto até o ninho, eliminando a rainha. Bisnaga 10g com armagante.",
    "caracteristicas": [
      "Ingrediente ativo Hidrametilnona (ação lenta)",
      "Elimina a rainha e toda a colônia",
      "Isca atrativa para formigas doceiras",
      "Contém armagante (segurança extra)",
      "Sem odor — ideal para uso interno",
      "Uso doméstico e profissional",
      "Bisnaga aplicadora com 10g"
    ],
    "imagens": [
      "img/produtos/p35-kromax-gel-mata-formiga-10g.webp"
    ],
    "unidade": "bisnaga",
    "referencia": "KROMAX-FORM-10G",
    "rendimento": "1 bisnaga de 10g trata múltiplos pontos de infestação. Reaplique conforme consumo da isca.",
    "destaque": false,
    "preco_base": 7.98,
    "badge_texto": "Elimina o Ninho",
    "badge_tipo": "profissional",
    "icones_representativos": ["🐜", "🎯", "🏚️"],
    "manual_aplicacao": {
      "resumo_aplicador": "Gel inseticida com Hidrametilnona de ação lenta para eliminação total de colônias de formigas doceiras. As operárias consomem e transportam a isca até o ninho, eliminando a rainha e toda a colônia de dentro para fora. Contém armagante.",
      "checklist_previo": [
        "Identifique o tipo de formiga: produto específico para formigas doceiras (pequenas, que atacam alimentos açucarados). Para formigas cortadeiras (saúva), usar formicida específico.",
        "Mapeie os trajetos: observe por onde as formigas transitam — essas são as trilhas de comunicação com o ninho.",
        "Não use spray antes do gel: inseticidas de contato matam as operárias antes que levem o gel ao ninho, anulando o efeito cascata.",
        "Higienize os alimentos expostos: remova fontes de comida alternativas para que a isca seja a atração principal."
      ],
      "equipamentos": [
        "A própria bisnaga aplicadora (produto pronto para uso)",
        "Luvas descartáveis para manuseio",
        "Palito ou espátula para aplicação em frestas muito estreitas (opcional)"
      ],
      "dosagem": {
        "pequena_area": {
          "titulo": "Aplicação Pontual (por trilha)",
          "dose": "Gotas de 0,1 a 0,3g por ponto, ao longo da trilha de formigas",
          "cobertura": "1 bisnaga de 10g rende de 30 a 100 pontos de aplicação"
        },
        "area_total": {
          "titulo": "Infestação em Ambiente (cozinha/área de serviço)",
          "dose": "Aplique em todos os pontos críticos: rodapés, frestas, atrás de eletrodomésticos e sob armários",
          "cobertura": "1 bisnaga trata completamente 1 a 2 ambientes infestados com múltiplos formigueiros"
        },
        "instrucao_diluicao": "Produto pronto para uso. Retire a tampa da bisnaga, encaixe o bico aplicador e pressione levemente para liberar gotas ou filetes no local desejado. Não diluir."
      },
      "passos": [
        {
          "passo": 1,
          "titulo": "Mapeamento das Trilhas de Formigas",
          "descricao": "Observe os caminhos das formigas por alguns minutos. As trilhas são os canais de comunicação com o ninho — é nesses pontos que o gel deve ser aplicado para garantir que as operárias o encontrem e transportem.",
          "dica_do_aplicador": "Aplique o gel ao lado da trilha, não em cima dela, para não interromper o fluxo de formigas. Elas devem circular livremente e encontrar o gel naturalmente."
        },
        {
          "passo": 2,
          "titulo": "Aplicação Estratégica do Gel",
          "descricao": "Aplique pequenas gotas ou filetes um pouco acima ou abaixo das trilhas. Priorize: frestas, fendas, rodapés, atrás de geladeiras e fogões, sob pias e dentro de armários. O bico aplicador da bisnaga permite precisão em locais estreitos.",
          "dica_do_aplicador": "Aplique em múltiplos pontos ao longo da trilha para aumentar as chances de contato. Quanto mais operárias carregarem o gel, mais rápida será a eliminação da colônia."
        },
        {
          "passo": 3,
          "titulo": "Aguardar — Não Perturbe as Formigas",
          "descricao": "Não remova o gel, não limpe a área e não use spray por pelo menos 48 horas. O aumento temporário de formigas próximo ao gel é NORMAL e sinal de que a isca está sendo aceita. As operárias estão coletando e levando para o ninho.",
          "alerta": "Matar as formigas manualmente ou com spray durante esse período interrompe o processo de contaminação da colônia e desperdiça o produto."
        },
        {
          "passo": 4,
          "titulo": "Monitoramento e Reaplicação",
          "descricao": "Após 5 a 10 dias, observe a redução progressiva do número de formigas. Reaplique onde a isca estiver consumida. Em ninhos grandes ou infestações severas, uma segunda aplicação completa após 15 dias garante a eliminação total.",
          "dica_do_aplicador": "Se as formigas pararem de consumir o gel após 3 a 4 dias sem eliminação visível, mude os pontos de aplicação — o ninho pode estar em outra direção."
        }
      ],
      "linha_do_tempo": [
        {
          "periodo": "Imediato",
          "titulo": "Isca Aceita",
          "descricao": "As formigas operárias são atraídas pelo aroma alimentar irresistível do gel e iniciam o consumo e transporte até o ninho.",
          "icone": "🎯"
        },
        {
          "periodo": "24 a 48 Horas",
          "titulo": "Contaminação da Colônia",
          "descricao": "A Hidrametilnona é distribuída internamente pelas operárias e compartilhada com a rainha e demais indivíduos do ninho. Pode haver aumento temporário de formigas visíveis — sinal positivo.",
          "icone": "🐜"
        },
        {
          "periodo": "3 a 7 Dias",
          "titulo": "Eliminação Progressiva",
          "descricao": "Redução visível e progressiva da infestação. Número de formigas diminui conforme a colônia é contaminada internamente.",
          "icone": "📉"
        },
        {
          "periodo": "10 a 15 Dias",
          "titulo": "Extinção Total da Colônia",
          "descricao": "A rainha e toda a colônia são eliminadas. Reaplique se necessário para garantir a eliminação de ninhos secundários ou novas colônias migrantes.",
          "icone": "🏚️"
        }
      ]
    }
  },
  {
    "id": 36,
    "nome": "Repelente de Pombos Krodec",
    "categoria": "inseticidas",
    "tipo_formulacao": "gel-isca",
    "o_que_faz": "Afasta pombos e morcegos com gel físico atóxico — sem capturar, sem matar",
    "para_que_serve": "Gel repelente físico para afastar pombos e morcegos de beirais, marquises, telhados, coberturas e demais superfícies planas. Forma uma barreira desconfortável ao toque que impede a permanência dos animais sem causar danos ou capturá-los. Ideal para uso residencial, comercial e industrial. Rende de 10 a 15 metros lineares por bisnaga.",
    "como_age": "O gel forma uma barreira física de superfície pegajosa e desconfortável que, ao contato com as patas dos pombos e morcegos, causa estranhamento e desconforto, fazendo com que os animais abandonem o local espontaneamente. Não é tóxico, não captura e não machuca — apenas repele de forma segura e silenciosa.",
    "como_usar": "Limpe bem o local removendo fezes, ninhos e sujeiras antes de aplicar. Aplique o gel em zigue-zague sobre a superfície a ser protegida. Evite aplicar em locais expostos diretamente à chuva. Reaplique sempre que houver acúmulo de poeira ou após chuva forte. Para remover: espátula para o excesso, óleo mineral e depois água e sabão.",
    "onde_nao_usar": "Evitar aplicação sobre pedras naturais, mármore ou porcelanato — o gel pode causar manchas nessas superfícies. Não aplicar sobre alimentos ou utensílios. Não usar em locais onde possa ser removido facilmente pela chuva sem proteção.",
    "seguranca": {
      "pets": "Produto atóxico — não causa intoxicação em animais domésticos. Manter fora do alcance de crianças e pets durante a aplicação. O gel não captura nem machuca os animais-alvo, apenas os repele.",
      "chuva": "Evitar aplicar com chuva prevista. Reaplique sempre que a barreira for comprometida por chuva forte, poeira excessiva ou sujeira. Prefira superfícies protegidas ou cobertas.",
      "horario": "Aplicar em dia seco e ensolarado para melhor aderência do gel à superfície. Limpe e seque bem o local antes da aplicação.",
      "epi": "Evitar contato direto com olhos e mucosas durante a aplicação. Usar luvas para evitar contato da mão com o gel. Armazenar em local seco, longe da luz solar direta."
    },
    "alvos": [
      "pombos",
      "morcegos",
      "aves",
      "pássaros",
      "beiral",
      "marquise",
      "telhado"
    ],
    "descricao": "Gel físico repelente atóxico para afastar pombos e morcegos de beirais, marquises e telhados. Ação por barreira de contato. Rende 10 a 15 metros lineares por bisnaga.",
    "caracteristicas": [
      "100% atóxico e não poluente",
      "Não captura — apenas repele",
      "Eficaz contra pombos e morcegos",
      "Rende 10 a 15 metros lineares",
      "Gel pronto para uso",
      "Ação prolongada e duradoura",
      "Uso externo em beirais e marquises"
    ],
    "imagens": [
      "img/produtos/p36-repelente-pombos-krodec.webp"
    ],
    "unidade": "bisnaga",
    "referencia": "KRODEC-REP-POMBO",
    "rendimento": "Cada bisnaga rende de 10 a 15 metros lineares de barreira repelente.",
    "destaque": false,
    "preco_base": 24.09,
    "badge_texto": "Atóxico",
    "badge_tipo": "natural",
    "icones_representativos": ["🕊️", "🦇", "🏚️"],
    "manual_aplicacao": {
      "resumo_aplicador": "Gel físico repelente atóxico para afastar pombos e morcegos de superfícies externas. Forma barreira de desconforto ao toque sem capturar ou machucar os animais. Aplicação em zigue-zague. Rende 10 a 15 metros lineares por bisnaga.",
      "checklist_previo": [
        "Limpe o local antes de tudo: remova completamente fezes, ninhos, penas e sujeiras. O gel não adere corretamente em superfícies sujas ou úmidas.",
        "Seque a superfície: aplique apenas em superfícies secas para garantir máxima aderência e durabilidade do gel.",
        "Verifique o tipo de superfície: EVITAR pedras naturais, mármore e porcelanato — o gel pode causar manchas permanentes nessas superfícies.",
        "Avalie a exposição à chuva: prefira aplicar em locais protegidos ou semi-cobertos para maior durabilidade da barreira."
      ],
      "equipamentos": [
        "A própria bisnaga de gel (produto pronto para uso — aplicador não incluso)",
        "Pistola aplicadora de silicone (recomendada para melhor controle da aplicação)",
        "Espátula para remoção do excesso quando necessário",
        "Óleo mineral para limpeza e remoção do gel das mãos ou superfícies",
        "Luvas de proteção e óculos durante a aplicação"
      ],
      "dosagem": {
        "pequena_area": {
          "titulo": "Proteção de Trecho Curto (até 5m)",
          "dose": "Filetes em zigue-zague contínuo a cada 10 cm sobre a superfície",
          "cobertura": "Meia bisnaga cobre de 5 a 7 metros lineares de proteção"
        },
        "area_total": {
          "titulo": "Proteção de Beiral ou Marquise (bisnaga inteira)",
          "dose": "Filetes em zigue-zague sobre toda a extensão da superfície a proteger",
          "cobertura": "1 bisnaga cobre de 10 a 15 metros lineares de superfície"
        },
        "instrucao_diluicao": "Produto pronto para uso. Encaixe a bisnaga na pistola aplicadora (ou use diretamente), e aplique o gel em movimentos de zigue-zague contínuo sobre a superfície limpa e seca. Não diluir."
      },
      "passos": [
        {
          "passo": 1,
          "titulo": "Limpeza e Preparação da Superfície",
          "descricao": "Remova completamente fezes, ninhos, penas e qualquer sujeira da superfície a ser tratada. Use vassoura, espátula e água com detergente. Aguarde secar completamente antes de aplicar o gel — a aderência depende de uma superfície limpa e seca.",
          "alerta": "Aplicar sobre superfície suja ou úmida compromete a aderência do gel e reduz drasticamente a durabilidade da barreira repelente."
        },
        {
          "passo": 2,
          "titulo": "Aplicação em Zigue-Zague",
          "descricao": "Aplique o gel em movimento de zigue-zague contínuo sobre toda a extensão da superfície a proteger (beiral, borda de marquise, telhado, etc.). O padrão em zigue-zague garante cobertura eficiente e impede que os pombos encontrem espaço de pouso entre os filetes.",
          "dica_do_aplicador": "Use uma pistola aplicadora de silicone para melhor controle do fluxo e uniformidade da aplicação. Isso também aumenta o rendimento da bisnaga."
        },
        {
          "passo": 3,
          "titulo": "Verificação da Barreira",
          "descricao": "Após a aplicação, verifique se toda a extensão da superfície está coberta com filetes contínuos de gel. Reforce os pontos de pouso preferenciais dos pombos (onde há mais sujeira concentrada) com uma camada extra de gel.",
          "dica_do_aplicador": "Pombos costumam preferir bordas e cantos para pousar — dê atenção especial a esses pontos para garantir máxima eficácia."
        },
        {
          "passo": 4,
          "titulo": "Manutenção e Reaplicação",
          "descricao": "Verifique a barreira periodicamente, especialmente após chuvas fortes ou períodos de muita poeira. Reaplique onde o gel estiver ressecado, coberto de poeira ou removido. Para remover o gel antigo: espátula para o excesso, óleo mineral para dissolver o resíduo e água com sabão para finalizar.",
          "alerta": "Não use solventes agressivos ou produtos abrasivos para remover o gel — use apenas óleo mineral seguido de água e sabão."
        }
      ],
      "linha_do_tempo": [
        {
          "periodo": "Imediato",
          "titulo": "Barreira Ativa",
          "descricao": "O gel está ativo assim que aplicado. Pombos e morcegos que tentarem pousar sentirão o desconforto imediatamente e abandonarão o local.",
          "icone": "🛡️"
        },
        {
          "periodo": "Primeiros Dias",
          "titulo": "Afastamento Progressivo",
          "descricao": "Os pombos tentarão retornar algumas vezes antes de desistirem definitivamente do local. A persistência da barreira é essencial nesse período.",
          "icone": "🕊️"
        },
        {
          "periodo": "1 a 2 Semanas",
          "titulo": "Abandono do Local",
          "descricao": "Com a barreira íntegra, os pombos e morcegos abandonam o ponto de pouso e não retornam, desde que a superfície continue protegida.",
          "icone": "✅"
        },
        {
          "periodo": "Conforme necessário",
          "titulo": "Reaplicação de Manutenção",
          "descricao": "Reaplique sempre que o gel estiver comprometido por poeira, chuva forte ou desgaste natural para manter a proteção contínua e duradoura.",
          "icone": "🔄"
        }
      ]
    }
  }
];