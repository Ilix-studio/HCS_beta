import type { Availability, Product } from '../types'

type Row = [id: string, brand: string, generic: string, mfr: string, cat: string, strength: string, form: string, pack: string, mrp: number, price: number, stock: number, rx: boolean, pop: number, composition?: string]

const rows: Row[] = [
  ['p1', 'Paracet 500', 'Paracetamol', 'm1', 'pain', '500 mg', 'Tablet', 'Strip of 15', 30, 24, 320, false, 98],
  ['p2', 'Ibufen 400', 'Ibuprofen', 'm1', 'pain', '400 mg', 'Tablet', 'Strip of 10', 42, 35, 210, false, 90],
  ['p3', 'Diclofast 50', 'Diclofenac Sodium', 'm1', 'pain', '50 mg', 'Tablet', 'Strip of 10', 55, 46, 8, true, 64],
  ['p4', 'Amlocard 5', 'Amlodipine', 'm1', 'cardio', '5 mg', 'Tablet', 'Strip of 15', 68, 58, 140, true, 77],
  ['p5', 'Atorvin 10', 'Atorvastatin', 'm1', 'cardio', '10 mg', 'Tablet', 'Strip of 10', 110, 92, 95, true, 72],
  ['p6', 'Telmiva 40', 'Telmisartan', 'm1', 'cardio', '40 mg', 'Tablet', 'Strip of 15', 120, 99, 0, true, 55],
  ['p7', 'Cetrizo 10', 'Cetirizine', 'm1', 'tablets', '10 mg', 'Tablet', 'Strip of 10', 28, 22, 400, false, 85],
  ['p8', 'Pantosec 40', 'Pantoprazole', 'm1', 'tablets', '40 mg', 'Tablet', 'Strip of 15', 95, 79, 180, false, 80],
  ['p9', 'Amoxiclav 625', 'Amoxicillin + Clavulanic Acid', 'm2', 'antibiotics', '500 mg + 125 mg', 'Tablet', 'Strip of 6', 210, 178, 120, true, 81, 'Amoxicillin 500 mg, Clavulanic Acid 125 mg'],
  ['p10', 'Azithra 500', 'Azithromycin', 'm2', 'antibiotics', '500 mg', 'Tablet', 'Strip of 3', 130, 109, 90, true, 75],
  ['p11', 'Cefixo 200', 'Cefixime', 'm2', 'antibiotics', '200 mg', 'Tablet', 'Strip of 10', 160, 135, 60, true, 60],
  ['p12', 'Doxylab 100', 'Doxycycline', 'm2', 'capsules', '100 mg', 'Capsule', 'Strip of 10', 95, 80, 75, true, 58],
  ['p13', 'Omega Pure', 'Omeprazole', 'm2', 'capsules', '20 mg', 'Capsule', 'Strip of 15', 70, 58, 260, false, 70],
  ['p14', 'CoughEase', 'Dextromethorphan + Chlorpheniramine', 'm2', 'syrups', '15 mg/5 ml', 'Syrup', 'Bottle 100 ml', 85, 72, 150, false, 66],
  ['p15', 'Digezyme Syrup', 'Digestive Enzymes', 'm2', 'syrups', '—', 'Syrup', 'Bottle 200 ml', 120, 98, 12, false, 52],
  ['p16', 'Amoxi Kid Suspension', 'Amoxicillin', 'm2', 'syrups', '125 mg/5 ml', 'Syrup', 'Bottle 60 ml', 78, 65, 85, true, 50],
  ['p17', 'VitaD3 60K', 'Cholecalciferol', 'm3', 'vitamins', '60000 IU', 'Capsule', 'Pack of 4', 140, 118, 300, false, 92],
  ['p18', 'B-Complex Plus', 'Vitamin B Complex', 'm3', 'vitamins', '—', 'Capsule', 'Strip of 20', 90, 74, 280, false, 78],
  ['p19', 'ImmuneC 500', 'Vitamin C', 'm3', 'vitamins', '500 mg', 'Tablet', 'Bottle of 30', 150, 125, 220, false, 88],
  ['p20', 'Calcimax', 'Calcium + Vitamin D3', 'm3', 'vitamins', '500 mg + 250 IU', 'Tablet', 'Strip of 15', 120, 99, 190, false, 74],
  ['p21', 'DermaClear Cream', 'Clotrimazole', 'm3', 'derma', '1% w/w', 'Cream', 'Tube 15 g', 75, 62, 130, false, 63],
  ['p22', 'Betaskin', 'Betamethasone', 'm3', 'derma', '0.1% w/w', 'Cream', 'Tube 20 g', 98, 82, 70, true, 49],
  ['p23', 'WoundCare Antiseptic', 'Povidone Iodine', 'm3', 'firstaid-med', '5% w/v', 'Solution', 'Bottle 100 ml', 65, 54, 240, false, 69],
  ['p24', 'ORS Quick', 'Oral Rehydration Salts', 'm3', 'firstaid-med', '—', 'Powder', 'Sachet x 5', 45, 38, 350, false, 71],
  ['p25', 'Metforin 500', 'Metformin', 'm4', 'diabetes', '500 mg', 'Tablet', 'Strip of 20', 48, 40, 410, true, 91],
  ['p26', 'Glimestar 2', 'Glimepiride', 'm4', 'diabetes', '2 mg', 'Tablet', 'Strip of 15', 115, 96, 160, true, 68],
  ['p27', 'Sitagly 50', 'Sitagliptin', 'm4', 'diabetes', '50 mg', 'Tablet', 'Strip of 7', 310, 265, 40, true, 54],
  ['p28', 'GlucoCheck Strips', 'Blood Glucose Test Strips', 'm4', 'diabetes', '—', 'Strips', 'Pack of 50', 899, 780, 90, false, 76],
  ['p29', 'DigiBP Arm Monitor', 'Digital Blood Pressure Monitor', 'm5', 'bp', '—', 'Device', '1 unit', 2499, 1999, 45, false, 84],
  ['p30', 'ThermoFlash IR', 'Infrared Thermometer', 'm5', 'thermometers', '—', 'Device', '1 unit', 1199, 899, 110, false, 87],
  ['p31', 'DualHead Steth', 'Dual Head Stethoscope', 'm5', 'stethoscopes', '—', 'Device', '1 unit', 1450, 1190, 35, false, 59],
  ['p32', 'OxyMask Adult', 'Oxygen Mask with Tubing', 'm5', 'oxygen', '—', 'Device', 'Pack of 1', 350, 280, 6, false, 44],
  ['p33', 'WeighWell Scale', 'Digital Weighing Scale', 'm5', 'scales', '—', 'Device', '1 unit', 1899, 1499, 52, false, 61],
  ['p34', 'ResusBag Pro', 'Manual Resuscitator (Ambu Bag)', 'm5', 'resus', '—', 'Device', '1 unit', 3200, 2750, 14, false, 40],
  ['p35', 'FirstAid Home Kit', 'First Aid Kit (60 pcs)', 'm6', 'firstaid-kits', '—', 'Kit', '1 kit', 799, 649, 120, false, 86],
  ['p36', 'FlexiPlast Strips', 'Adhesive Plasters', 'm6', 'plasters', '—', 'Strips', 'Box of 100', 180, 149, 340, false, 83],
  ['p37', 'PureCotton Roll', 'Absorbent Cotton Wool', 'm6', 'cotton', '—', 'Roll', '500 g', 160, 135, 200, false, 57],
  ['p38', 'ProtectMask 3-Ply', 'Surgical Face Mask', 'm6', 'masks', '—', 'Mask', 'Box of 50', 250, 199, 500, false, 89],
  ['p39', 'CompressFlex Bandage', 'Elastic Compression Bandage', 'm6', 'bandages', '10 cm x 4.5 m', 'Bandage', '1 roll', 220, 180, 175, false, 62],
  ['p40', 'PregCheck Rapid', 'Pregnancy Test Kit (hCG)', 'm6', 'pregnancy', '—', 'Test Kit', 'Pack of 2', 150, 120, 260, false, 73],
]

const availability = (stock: number): Availability => (stock === 0 ? 'out_of_stock' : stock < 20 ? 'low_stock' : 'in_stock')

export const products: Product[] = rows.map(([id, brand, generic, manufacturerId, categoryId, strength, dosageForm, packSize, mrp, price, stock, prescriptionRequired, popularity, composition]) => ({
  id, brand, generic, manufacturerId, categoryId, strength, dosageForm, packSize, mrp, price, stock, prescriptionRequired, popularity,
  composition: composition ?? `${generic}${strength !== '—' ? ' ' + strength : ''}`,
  availability: availability(stock),
  description: `${brand} (${generic}) is supplied as ${dosageForm.toLowerCase()} in a ${packSize.toLowerCase()} pack. Mock listing for demonstration purposes only.`,
  safety: prescriptionRequired
    ? 'Prescription-only. Use only as directed by a registered medical practitioner. Read the patient information leaflet and consult your doctor or pharmacist with questions.'
    : 'Read the label and patient information leaflet before use. Keep out of reach of children. Consult a pharmacist or doctor if symptoms persist or you are unsure.',
  status: 'active' as const,
  updatedAt: '2026-10-' + String(10 + (popularity % 18)).padStart(2, '0'),
}))
