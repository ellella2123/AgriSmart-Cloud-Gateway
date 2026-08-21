const fs = require('fs');

function upgradeFarmersDashboard() {
  const file = 'src/components/FarmersDashboard.tsx';
  let content = fs.readFileSync(file, 'utf-8');

  // Background gradients, shadows, scale on hover
  content = content.replace(
    /bg-white\/80 backdrop-blur-md rounded-\[2rem\] p-6 sm:p-8 border border-gray-100 shadow-\[0_8px_30px_rgba\(0,0,0,0\.04\)\] space-y-6 hover:shadow-\[0_8px_40px_rgba\(16,185,129,0\.08\)\] transition-shadow duration-500/g,
    'bg-gradient-to-br from-white/95 to-emerald-50/50 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-6 hover:shadow-[0_16px_50px_rgba(16,185,129,0.15)] transition-all duration-500 hover:scale-[1.01]'
  );
  
  content = content.replace(
    /bg-white\/80 backdrop-blur-md rounded-\[2rem\] p-6 sm:p-8 border border-gray-100 shadow-\[0_8px_30px_rgba\(0,0,0,0\.04\)\] flex flex-col md:flex-row items-center justify-between gap-4/g,
    'bg-gradient-to-br from-white/95 to-emerald-50/50 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-[0_16px_50px_rgba(16,185,129,0.15)] transition-all duration-500 hover:scale-[1.01]'
  );

  content = content.replace(
    /bg-white\/80 backdrop-blur-md p-6 rounded-\[2rem\] border border-gray-100 shadow-\[0_8px_30px_rgba\(0,0,0,0\.04\)\] hover:shadow-\[0_8px_40px_rgba\(16,185,129,0\.08\)\] transition-shadow duration-500/g,
    'bg-gradient-to-br from-white/95 to-emerald-50/50 backdrop-blur-md p-6 rounded-[2rem] border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_50px_rgba(16,185,129,0.15)] transition-all duration-500 hover:scale-[1.01]'
  );

  content = content.replace(
    /bg-white\/70 backdrop-blur-xl border border-white\/40 hover:bg-white hover:-translate-y-1 hover:shadow-lg transition-all rounded-\[2rem\] shadow-\[0_8px_30px_rgba\(0,0,0,0\.04\)\] cursor-pointer group text-center gap-3/g,
    'bg-gradient-to-br from-white/80 to-emerald-50/40 backdrop-blur-xl border border-white/60 hover:bg-gradient-to-br hover:from-white hover:to-emerald-50/60 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(16,185,129,0.2)] transition-all duration-300 rounded-[2rem] shadow-[0_8px_30px_rgba(16,185,129,0.06)] cursor-pointer group text-center gap-3'
  );

  content = content.replace(
    /bg-slate-50 border border-gray-200 p-4\.5 rounded-2xl/g,
    'bg-gradient-to-br from-slate-50 to-white border border-gray-200/80 p-4.5 rounded-2xl shadow-sm hover:shadow-[0_8px_24px_rgba(16,185,129,0.12)] hover:scale-[1.02] transition-all duration-300'
  );

  content = content.replace(
    /bg-emerald-50\/70 border border-emerald-200\/80 p-4\.5 rounded-2xl/g,
    'bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200/60 p-4.5 rounded-2xl shadow-sm hover:shadow-[0_8px_24px_rgba(16,185,129,0.15)] hover:scale-[1.02] transition-all duration-300'
  );
  
  // Additional box updates
  content = content.replace(
    /bg-white rounded-3xl border border-gray-100 shadow-md p-6/g,
    'bg-gradient-to-br from-white/95 to-emerald-50/30 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 p-6'
  );
  
  content = content.replace(
    /bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-md p-4/g,
    'bg-gradient-to-br from-white/95 to-emerald-50/30 rounded-2xl sm:rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(16,185,129,0.15)] hover:scale-[1.01] transition-all duration-300 p-4'
  );
  
  content = content.replace(
    /bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6/g,
    'bg-gradient-to-br from-white/95 to-emerald-50/20 p-6 rounded-2xl border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 transition-all duration-300 space-y-6'
  );

  content = content.replace(
    /bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6/g,
    'bg-gradient-to-br from-white/95 to-emerald-50/20 p-6 rounded-3xl border border-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 transition-all duration-300 space-y-6'
  );

  // Text pop (boldness, contrast, drop shadow)
  content = content.replace(/text-xl font-extrabold text-gray-900/g, 'text-xl font-black text-gray-900 drop-shadow-sm');
  content = content.replace(/text-lg font-bold text-gray-900/g, 'text-lg font-extrabold text-emerald-950 drop-shadow-sm');
  content = content.replace(/text-2xl font-extrabold text-gray-900/g, 'text-2xl font-black text-emerald-950 drop-shadow-sm');
  content = content.replace(/text-3xl font-extrabold text-emerald-950/g, 'text-3xl font-black text-emerald-950 drop-shadow-md');
  content = content.replace(/text-3xl font-black text-emerald-950/g, 'text-3xl font-black text-emerald-950 drop-shadow-md'); // In case it's already black
  
  // More specific text pops
  content = content.replace(/text-sm font-bold text-gray-900/g, 'text-sm font-extrabold text-emerald-950 drop-shadow-sm');

  fs.writeFileSync(file, content);
  console.log('FarmersDashboard updated');
}

function upgradeApp() {
  const file = 'src/App.tsx';
  let content = fs.readFileSync(file, 'utf-8');

  // Main wrapper bg
  content = content.replace(
    /bg-white\/80 backdrop-blur-2xl/g,
    'bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/40 backdrop-blur-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] ring-1 ring-white/60'
  );
  
  // Nav bg
  content = content.replace(
    /bg-white\/85 backdrop-blur-xl/g,
    'bg-gradient-to-r from-white/95 to-emerald-50/90 backdrop-blur-xl'
  );

  fs.writeFileSync(file, content);
  console.log('App updated');
}

upgradeFarmersDashboard();
upgradeApp();
