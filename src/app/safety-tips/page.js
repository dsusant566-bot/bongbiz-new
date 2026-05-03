export default function SafetyTips() {
  return (
    <div className="max-w-4xl mx-auto p-10 text-slate-800">
      <h1 className="text-3xl font-black uppercase italic border-l-8 border-blue-600 pl-4 mb-8">Safety Tips for Users</h1>
      <div className="space-y-6 font-medium leading-relaxed">
        <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h2 className="text-xl font-bold mb-3 text-blue-700">For Buyers:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Inspect Before Pay:</strong> Always check the item thoroughly in person before making any payment.</li>
            <li><strong>Meet in Public:</strong> Meet the seller in a safe, public location like a mall, station, or marketplace.</li>
            <li><strong>Avoid Advance Payments:</strong> Never send money via UPI or Bank Transfer as a "deposit" or "booking fee" before seeing the product.</li>
            <li><strong>Verify Documents:</strong> For vehicles or property, check all original legal documents carefully.</li>
          </ul>
        </section>

        <section className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
          <h2 className="text-xl font-bold mb-3 text-orange-700">For Sellers:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Verify Payment:</strong> Do not hand over the item until you have confirmed the full payment in your account or cash.</li>
            <li><strong>Beware of Fake Screenshots:</strong> Be careful of scammers showing fake payment success screenshots.</li>
            <li><strong>Don't Share OTPs:</strong> No legitimate buyer needs your OTP or bank details to send you money.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}