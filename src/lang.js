import { t as base } from './i18n'

const X = {
  en: {
    dashboard: 'Dashboard', roleQ: 'I am a', signIn: 'Sign in', phone: 'Mobile number (10 digits)', emailOpt: 'Email (optional)',
    idLabel: 'Mobile number or email', password: 'Password', pwHint: 'Password (at least 6 characters)',
    forgot: 'Forgot password?', newHere: 'New here? Create account', haveAcc: 'Already have an account? Sign in',
    sendOtp: 'Send OTP', verifyBtn: 'Verify and continue', otpTitle: 'Enter OTP', otpDemo: 'Demo OTP:',
    otpWhy: 'Real SMS needs a paid service, so the code is shown here for the demo.', otpLabel: '6-digit OTP',
    badOtp: 'Wrong OTP. Try again.', badPhone: 'Enter a 10-digit mobile number.', badPw: 'Password must be at least 6 characters.',
    badEmail: 'Enter a valid email address.', badLogin: 'Wrong number, email or password.',
    noAccount: 'No account found. Please create one.', exists: 'This number or email already has an account. Please sign in.',
    resetPw: 'Reset password', newPw: 'New password (at least 6 characters)', pwUpdated: 'Password updated. Sign in now.',
    google: 'Continue with Google', googleNote: 'Demo only. Real Google sign-in needs a Google Cloud client ID.',
    googlePrompt: 'Demo Google sign-in: enter your email', demoTitle: 'Demo accounts for judges', or: 'or',
    postWork: 'Post work', myPosted: 'Work you posted', applicants: 'Interested workers', noPosted: 'You have not posted any work yet.',
    noApplicants: 'No one has shown interest yet.', accept: 'Accept', reject: 'Reject', accepted: 'Accepted', rejected: 'Rejected',
    requested: 'Requested', jobTitle: 'Work title', descr: 'Describe the work', budget: 'Budget in ₹ (paid work)', typeLbl: 'Type',
    urgencyLbl: 'Urgency', publish: 'Publish work', postedMsg: 'Work posted. Workers can see it now.', errJob: 'Add a title and a description.',
    noThreads: 'No conversations yet.',
    msgNote: 'Demo chat: works between two tabs of the same browser on this laptop. It is not live between different devices. "I have arrived" is a manual note, not proof of location.',
  },
  hi: {
    dashboard: 'डैशबोर्ड', roleQ: 'मैं हूँ', signIn: 'साइन इन', phone: 'मोबाइल नंबर (10 अंक)', emailOpt: 'ईमेल (ज़रूरी नहीं)',
    idLabel: 'मोबाइल नंबर या ईमेल', password: 'पासवर्ड', pwHint: 'पासवर्ड (कम से कम 6 अक्षर)',
    forgot: 'पासवर्ड भूल गए?', newHere: 'नए हैं? खाता बनाएँ', haveAcc: 'पहले से खाता है? साइन इन करें',
    sendOtp: 'OTP भेजें', verifyBtn: 'जाँचें और आगे बढ़ें', otpTitle: 'OTP डालें', otpDemo: 'डेमो OTP:',
    otpWhy: 'असली SMS के लिए पैसे वाली सेवा चाहिए, इसलिए डेमो में कोड यहीं दिखाया गया है।', otpLabel: '6 अंकों का OTP',
    badOtp: 'OTP गलत है। फिर कोशिश करें।', badPhone: '10 अंकों का मोबाइल नंबर डालें।', badPw: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।',
    badEmail: 'सही ईमेल पता डालें।', badLogin: 'नंबर, ईमेल या पासवर्ड गलत है।',
    noAccount: 'खाता नहीं मिला। कृपया नया खाता बनाएँ।', exists: 'इस नंबर या ईमेल से खाता पहले से है। कृपया साइन इन करें।',
    resetPw: 'पासवर्ड बदलें', newPw: 'नया पासवर्ड (कम से कम 6 अक्षर)', pwUpdated: 'पासवर्ड बदल गया। अब साइन इन करें।',
    google: 'Google से जारी रखें ', googleNote: 'सिर्फ डेमो। असली Google साइन-इन के लिए Google Cloud क्लाइंट आईडी चाहिए।',
    googlePrompt: 'डेमो Google साइन-इन: अपना ईमेल डालें', demoTitle: 'जजों के लिए डेमो खाते', or: 'या',
    postWork: 'काम पोस्ट करें', myPosted: 'आपका पोस्ट किया काम', applicants: 'रुचि दिखाने वाले कामगार', noPosted: 'आपने अभी कोई काम पोस्ट नहीं किया है।',
    noApplicants: 'अभी किसी ने रुचि नहीं दिखाई।', accept: 'स्वीकार करें', reject: 'अस्वीकार करें', accepted: 'स्वीकार किया', rejected: 'अस्वीकार किया',
    requested: 'अनुरोध भेजा', jobTitle: 'काम का शीर्षक', descr: 'काम के बारे में लिखें', budget: 'बजट ₹ में (पैसे वाले काम के लिए)', typeLbl: 'प्रकार',
    urgencyLbl: 'ज़रूरत', publish: 'काम प्रकाशित करें', postedMsg: 'काम पोस्ट हो गया। कामगार अब इसे देख सकते हैं।', errJob: 'शीर्षक और विवरण लिखें।',
    noThreads: 'अभी कोई बातचीत नहीं।',
    msgNote: 'डेमो चैट: इसी लैपटॉप पर एक ही ब्राउज़र के दो टैब के बीच चलती है। अलग-अलग डिवाइस के बीच लाइव नहीं है। "मैं पहुँच गया" एक हाथ से दर्ज की गई सूचना है, लोकेशन का सबूत नहीं।',
  },
}

export const t = (lang, key) => (X[lang] && X[lang][key]) || base(lang, key)