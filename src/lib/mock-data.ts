export type Supplier = {
  id: string;
  name: string;
  code: string;
  total: number;
  types: { name: string; index: string; count: number }[];
};

export type ReturnDocument = {
  id: string;
  supplierId: string;
  supplier: string;
  createdAt: string;
  containers: number;
  status: 'open' | 'ready' | 'completed';
  document?: string;
};

export type ScannedContainer = {
  serial: string;
  name: string;
  index: string;
  warehouse: string;
  series: string;
  supplierId: string;
};

export const suppliers: Supplier[] = [
  {
    id: 'nordchem', name: 'NordChem Polska Sp. z o.o.', code: 'D-00142', total: 4,
    types: [
      { name: 'Paletopojemnik IBC 1000 l', index: 'OP-IBC-1000', count: 2 },
      { name: 'Beczka stalowa 200 l', index: 'OP-BECZ-200', count: 1 },
      { name: 'Paleta CP1', index: 'OP-PAL-CP1', count: 1 }
    ]
  },
  {
    id: 'coloris', name: 'Coloris Industrial GmbH', code: 'D-00087', total: 2,
    types: [
      { name: 'Beczka stalowa 200 l', index: 'OP-BECZ-200', count: 1 },
      { name: 'Paletopojemnik IBC 1000 l', index: 'OP-IBC-1000', count: 1 }
    ]
  },
  {
    id: 'chemtrade', name: 'ChemTrade S.A.', code: 'D-00205', total: 2,
    types: [
      { name: 'Kanister HDPE 30 l', index: 'OP-KAN-030', count: 1 },
      { name: 'Paleta EUR', index: 'OP-PAL-EUR', count: 1 }
    ]
  },
  {
    id: 'pigment', name: 'Pigment Solutions s.r.o.', code: 'D-00118', total: 1,
    types: [{ name: 'Big Bag 1000 kg', index: 'OP-BB-1000', count: 1 }]
  }
];

export const initialReturns: ReturnDocument[] = [
  { id: '1', supplierId: 'nordchem', supplier: 'NordChem Polska Sp. z o.o.', createdAt: 'Dzisiaj, 08:42', containers: 2, status: 'open' },
  { id: '2', supplierId: 'coloris', supplier: 'Coloris Industrial GmbH', createdAt: 'Wczoraj, 14:18', containers: 2, status: 'ready' },
  { id: '3', supplierId: 'chemtrade', supplier: 'ChemTrade S.A.', createdAt: '28.08.2026, 11:07', containers: 2, status: 'completed', document: 'ZD/004821/26' }
];

export const scanPool: Record<string, ScannedContainer> = {
  'IBC-NC-240018': { serial: 'IBC-NC-240018', name: 'Paletopojemnik IBC 1000 l', index: 'OP-IBC-1000', warehouse: 'M01', series: 'IBC-1000-A', supplierId: 'nordchem' },
  'IBC-NC-240021': { serial: 'IBC-NC-240021', name: 'Paletopojemnik IBC 1000 l', index: 'OP-IBC-1000', warehouse: 'M03', series: 'IBC-1000-A', supplierId: 'nordchem' },
  'BEC-NC-008419': { serial: 'BEC-NC-008419', name: 'Beczka stalowa 200 l', index: 'OP-BECZ-200', warehouse: 'M01', series: 'BECZ-200-B', supplierId: 'nordchem' },
  'PAL-NC-000774': { serial: 'PAL-NC-000774', name: 'Paleta CP1', index: 'OP-PAL-CP1', warehouse: 'M02', series: 'CP1-2026', supplierId: 'nordchem' },
  'BEC-CI-001102': { serial: 'BEC-CI-001102', name: 'Beczka stalowa 200 l', index: 'OP-BECZ-200', warehouse: 'M01', series: 'BECZ-200-C', supplierId: 'coloris' },
  'IBC-CI-003841': { serial: 'IBC-CI-003841', name: 'Paletopojemnik IBC 1000 l', index: 'OP-IBC-1000', warehouse: 'M02', series: 'IBC-1000-C', supplierId: 'coloris' },
  'KAN-CT-000221': { serial: 'KAN-CT-000221', name: 'Kanister HDPE 30 l', index: 'OP-KAN-030', warehouse: 'M03', series: 'KAN-30-D', supplierId: 'chemtrade' },
  'PAL-CT-000112': { serial: 'PAL-CT-000112', name: 'Paleta EUR', index: 'OP-PAL-EUR', warehouse: 'M01', series: 'EUR-2026', supplierId: 'chemtrade' },
  'BB-PS-000031': { serial: 'BB-PS-000031', name: 'Big Bag 1000 kg', index: 'OP-BB-1000', warehouse: 'M02', series: 'BB-1000-E', supplierId: 'pigment' }
};

export const allContainers = Object.values(scanPool);
