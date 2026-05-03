export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto p-10 text-slate-800 leading-relaxed">
      <h1 className="text-4xl font-black uppercase italic border-l-8 border-purple-600 pl-4 mb-8">About BongoBiz</h1>
      <div className="space-y-6 text-lg font-medium">
        <p>
          Welcome to <span className="text-purple-600 font-bold">BongoBiz</span>, the premier digital marketplace dedicated to the people of West Bengal. 
          Our mission is to simplify the way you buy and sell—from properties and vehicles to daily services and wholesale goods.
        </p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-10">Why BongoBiz?</h2>
        <p>
          We realized that finding a trusted platform to connect local buyers and sellers was difficult. 
          BongoBiz was built to bridge that gap. Whether you are looking for a resale car in Chakdaha or 
          wholesale supplies in Kolkata, we provide a fast, secure, and easy-to-use interface.
        </p>

        <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 mt-10">
          <h3 className="text-xl font-bold mb-4">Our Values:</h3>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Local First:</strong> Designed specifically for the needs of West Bengal's community.</li>
            <li><strong>Transparency:</strong> We encourage safe and direct communication between users.</li>
            <li><strong>Innovation:</strong> Using the latest technology to ensure your ads reach the right people.</li>
          </ul>
        </div>

        <p className="italic text-slate-500 mt-10">
          "Empowering small businesses and individuals to grow through a smarter marketplace."
        </p>
      </div>
    </div>
  );
}