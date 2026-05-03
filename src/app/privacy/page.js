export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-10 text-slate-800 leading-relaxed font-sans">
      <h1 className="text-3xl font-black uppercase mb-8 italic border-b-4 border-blue-600 pb-2">Privacy Policy</h1>
      
      <div className="space-y-6 text-sm md:text-base">
        <h2 className="text-xl font-bold">1. Information We Collect</h2>
        <p>We collect basic details such as name, phone number, and location to facilitate connections between users. We do not collect sensitive financial information like credit card or bank passwords.</p>

        <h2 className="text-xl font-bold">2. Public Visibility</h2>
        <p>When you post an ad, your provided contact number and location will be visible to other users. You acknowledge that BongoBiz is a public marketplace and we cannot control how other users use this visible information.</p>

        <h2 className="text-xl font-bold">3. Legal Disclosure</h2>
        <p>We reserve the right to disclose your personal information to <strong>Government or Law Enforcement agencies</strong> if required by law or in response to a valid legal request (e.g., in cases of fraud or criminal activity).</p>

        <h2 className="text-xl font-bold">4. Third-Party Links</h2>
        <p>Our site may contain links to other websites. We are not responsible for the privacy practices or content of those external sites.</p>

        <h2 className="text-xl font-bold">5. Consent</h2>
        <p>By using BongoBiz, you consent to our collection and use of your data as described in this policy.</p>
      </div>
    </div>
  );
}