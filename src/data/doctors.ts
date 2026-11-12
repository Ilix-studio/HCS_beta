import type { Doctor } from '../types'

type Row = [id: string, name: string, specialty: string, reg: string, clinic: string, exp: number, degrees: string, location: string, km: number, rating: number, fee: number, skin: string, hair: string]

const rows: Row[] = [
  ['d1', 'Dr. Meera Kapoor', 'General Physician', 'MH-2011-48213', 'Kapoor Family Clinic', 14, 'MBBS, MD (Internal Medicine)', 'Koregaon Park, Pune', 0.8, 4.8, 500, '#f1c9a5', '#2b1d14'],
  ['d2', 'Dr. Arjun Sethi', 'Cardiologist', 'KA-2009-33102', 'HeartCare Centre', 17, 'MBBS, MD, DM (Cardiology)', 'Kalyani Nagar, Pune', 1.6, 4.9, 900, '#d9a679', '#1a1a1a'],
  ['d3', 'Dr. Farah Ansari', 'Endocrinologist', 'TN-2013-27741', 'Metabolic Health Clinic', 12, 'MBBS, MD, DM (Endocrinology)', 'Viman Nagar, Pune', 2.3, 4.7, 800, '#e5b88f', '#3a2616'],
  ['d4', 'Dr. Nikhil Bose', 'Dermatologist', 'TS-2015-19980', 'ClearSkin Clinic', 10, 'MBBS, MD (Dermatology)', 'Baner, Pune', 3.1, 4.6, 700, '#f0c7a0', '#161616'],
  ['d5', 'Dr. Ananya Rao', 'Pediatrician', 'MH-2014-51200', 'Little Steps Child Care', 11, 'MBBS, MD (Pediatrics), DCH', 'Aundh, Pune', 3.4, 4.9, 600, '#e8bd96', '#2f1b12'],
  ['d6', 'Dr. Rahul Deshmukh', 'Orthopedic Surgeon', 'MH-2008-40977', 'BoneWell Ortho Centre', 18, 'MBBS, MS (Orthopaedics)', 'Shivajinagar, Pune', 4.0, 4.7, 1000, '#d29b6e', '#1c1c1c'],
  ['d7', 'Dr. Sneha Joshi', 'Gynecologist', 'MH-2012-46611', 'Women\'s Health Studio', 13, 'MBBS, MS (Obstetrics & Gynaecology)', 'Kothrud, Pune', 4.6, 4.8, 800, '#f2cfae', '#241512'],
  ['d8', 'Dr. Imran Qureshi', 'Pulmonologist', 'MH-2010-43388', 'BreatheEasy Chest Clinic', 15, 'MBBS, MD (Pulmonary Medicine)', 'Camp, Pune', 5.2, 4.6, 750, '#c98f64', '#141414'],
  ['d9', 'Dr. Kavita Menon', 'ENT Specialist', 'KL-2013-30912', 'ClearCare ENT', 9, 'MBBS, MS (ENT)', 'Wakad, Pune', 6.5, 4.5, 650, '#e6b48c', '#3b2a1b'],
  ['d10', 'Dr. Vivek Pillai', 'Psychiatrist', 'MH-2011-47766', 'MindWell Clinic', 12, 'MBBS, MD (Psychiatry)', 'Hadapsar, Pune', 7.8, 4.7, 900, '#dcaa80', '#1f1f1f'],
]

export const doctors: Doctor[] = rows.map(([id, name, specialty, registration, clinic, experience, degrees, location, distanceKm, rating, fee, skin, hair]) => ({
  id, name, specialty, registration, clinic: `${clinic}, ${location.split(', ')[1]}`, experience, degrees, location, distanceKm, rating, fee, skin, hair,
  email: name.toLowerCase().replace(/[^a-z ]/g, '').replace(/dr /, '').replace(/ /g, '.') + '@example.com',
}))
