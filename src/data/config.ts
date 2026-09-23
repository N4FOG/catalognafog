import type { Seller } from '../types/seller';

export const CONFIG = {
  whatsapp: '554599781407',
  empresa: 'JCV Química — Catálogo de Produtos 2026',
  mensagem_intro: 'Olá! Gostaria de solicitar uma cotação dos seguintes produtos através do catálogo JCV Química:',
  mensagem_fim: '✅ Aguardo retorno sobre disponibilidade e condições de fornecimento. Obrigado!',
  auditWebhookUrl: 'https://script.google.com/macros/s/AKfycbxUzA7UwZpAYatk1GgS0twILvztT3XLSlvH6SUdweZYKxPN_wwtCo5xxNY709aDTiQmjg/exec'
};

export const VENDEDORES: Seller[] = [
  { id: '', nome: 'Atendimento Geral / Central', whatsapp: '554599781407' },
  { id: 'carlos', nome: 'Carlos Silva', whatsapp: '554599781407' },
  { id: 'vendedor-1', nome: 'Vendedor 1', whatsapp: '554599781407' },
  { id: 'vendedor-2', nome: 'Vendedor 2', whatsapp: '554599781407' }
];
