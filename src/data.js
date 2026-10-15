import { Droplets, Zap, ChefHat, Baby, Home, Hammer, BrickWall, PaintRoller, SprayCan, Wrench, Cpu, HardHat, Sparkles } from 'lucide-react'
export const CATEGORIES = [
  ['plumber', Droplets], ['electrician', Zap], ['cook', ChefHat], ['nanny', Baby], ['helper', Home],
  ['carpenter', Hammer], ['mason', BrickWall], ['painter', PaintRoller], ['cleaner', SprayCan],
  ['mechanic', Wrench], ['technician', Cpu], ['labour', HardHat], ['other', Sparkles],
].map(([id, Icon]) => ({ id, Icon }))

// Illustrative mock data. Each job has a Hindi version in `hi`.
export const JOBS = [
  { id: 1, title: 'Electrician needed', cat: 'electrician', type: 'paid', mode: 'urgent', who: 'Household', area: 'Andheri East, Mumbai', lat: 19.1136, lng: 72.8697, pay: '₹800–₹1,200', dur: '2–3 hours', when: 'Today, by 6:00 PM', skills: ['Wiring', 'Troubleshooting', 'Repairs', 'MCB'], posted: 1, desc: 'Power trips in two rooms. Need someone to find the fault and fix it.',
    hi: { title: 'इलेक्ट्रीशियन चाहिए', who: 'घर', area: 'अंधेरी ईस्ट, मुंबई', dur: '2–3 घंटे', when: 'आज, शाम 6:00 बजे तक', skills: ['वायरिंग', 'खराबी ढूँढना', 'मरम्मत', 'एमसीबी'], desc: 'दो कमरों की बिजली बार-बार चली जाती है। खराबी ढूँढकर ठीक करनी है।' } },
  { id: 2, title: 'Cook for family dinners', cat: 'cook', type: 'paid', mode: 'scheduled', who: 'Family', area: 'Powai, Mumbai', lat: 19.1176, lng: 72.906, pay: '₹12,000 / month', dur: '2 hours daily', when: 'From 1 Nov, 6:30 PM', skills: ['North Indian', 'Tiffin', 'Veg'], posted: 5, desc: 'Cook for a family of four, vegetarian meals, 6 days a week.',
    hi: { title: 'परिवार के खाने के लिए रसोइया', who: 'परिवार', area: 'पवई, मुंबई', pay: '₹12,000 / माह', dur: 'रोज़ 2 घंटे', when: '1 नवंबर से, शाम 6:30 बजे', skills: ['उत्तर भारतीय', 'टिफिन', 'शाकाहारी'], desc: 'चार लोगों के परिवार के लिए शाकाहारी खाना, हफ़्ते में 6 दिन।' } },
  { id: 3, title: 'Fix leaking kitchen tap', cat: 'plumber', type: 'paid', mode: 'flexible', who: 'Household', area: 'Bandra West, Mumbai', lat: 19.0596, lng: 72.8295, pay: '₹500–₹700', dur: '1 hour', when: 'This week', skills: ['Taps', 'Pipe fitting'], posted: 20, desc: 'Tap drips constantly. Spare washer may be needed.',
    hi: { title: 'रसोई का टपकता नल ठीक करना', who: 'घर', area: 'बांद्रा वेस्ट, मुंबई', dur: '1 घंटा', when: 'इसी हफ़्ते', skills: ['नल', 'पाइप फिटिंग'], desc: 'नल से लगातार पानी टपकता है। नया वॉशर लग सकता है।' } },
  { id: 4, title: 'Repaint two bedrooms', cat: 'painter', type: 'paid', mode: 'scheduled', who: 'Small business', area: 'Goregaon East, Mumbai', lat: 19.1663, lng: 72.8526, pay: '₹9,000 total', dur: '3 days', when: '5 Nov, 9:00 AM', skills: ['Wall prep', 'Emulsion', 'Putty'], posted: 30, desc: 'Paint supplied. Worker brings brushes and rollers.',
    hi: { title: 'दो बेडरूम की पुताई', who: 'छोटा व्यवसाय', area: 'गोरेगांव ईस्ट, मुंबई', pay: '₹9,000 कुल', dur: '3 दिन', when: '5 नवंबर, सुबह 9:00 बजे', skills: ['दीवार तैयार करना', 'इमल्शन', 'पुट्टी'], desc: 'पेंट हम देंगे। ब्रश और रोलर कामगार लाएगा।' } },
  { id: 5, title: 'Help an elderly neighbour fix a door', cat: 'carpenter', type: 'volunteer', mode: 'scheduled', who: 'Community group', area: 'Dadar, Mumbai', lat: 19.0178, lng: 72.8478, pay: '', dur: '2 hours', when: 'Sat, 10:00 AM', skills: ['Hinges', 'Basic carpentry'], posted: 48, desc: 'Unpaid. Tea and local travel cost covered. Group coordinator will be present.',
    hi: { title: 'बुज़ुर्ग पड़ोसी का दरवाज़ा ठीक करने में मदद', who: 'सामुदायिक समूह', area: 'दादर, मुंबई', dur: '2 घंटे', when: 'शनिवार, सुबह 10:00 बजे', skills: ['कब्ज़े', 'सामान्य बढ़ईगिरी'], desc: 'बिना भुगतान। चाय और आने-जाने का स्थानीय खर्च दिया जाएगा। समूह का समन्वयक मौजूद रहेगा।' } },
  { id: 6, title: 'Community lane cleaning drive', cat: 'cleaner', type: 'volunteer', mode: 'flexible', who: 'Resident association', area: 'Kurla West, Mumbai', lat: 19.0728, lng: 72.8826, pay: '', dur: '3 hours', when: 'Sun, 8:00 AM', skills: ['Sweeping', 'Waste sorting'], posted: 60, desc: 'Unpaid. Gloves and bags provided. Not verified: meet in a public place first.',
    hi: { title: 'मोहल्ले की सफ़ाई का अभियान', who: 'रहवासी संघ', area: 'कुर्ला वेस्ट, मुंबई', dur: '3 घंटे', when: 'रविवार, सुबह 8:00 बजे', skills: ['झाड़ू', 'कचरा छाँटना'], desc: 'बिना भुगतान। दस्ताने और थैले दिए जाएँगे। जाँच नहीं हुई है: पहले किसी सार्वजनिक जगह पर मिलें।' } },
]
// Returns the job with text fields in the chosen language.
export const jl = (j, lang) => (lang === 'hi' ? { ...j, ...j.hi } : j)