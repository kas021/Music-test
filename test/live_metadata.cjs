// Opt-in live metadata check; emits NO media URLs, headers or credentials.
const fs=require('fs'),vm=require('vm'),path=require('path');
const ctx=vm.createContext({fetch:(u,o)=>fetch(u,{...o,signal:AbortSignal.timeout(15000)})});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../modules/ytmusic/index.js'),'utf8'),ctx);
(async()=>{
 const output=[];
 for(const query of ["Drake God's Plan",'GOHOBI Stay who you are','Morgan Wallen Last Thing You Need']) {
  const s=await ctx.searchResults(query,0);
  if(!s.ok) throw Error('Search failed');
  const tracks=JSON.parse(s.data);
  const track=tracks.find(t=>t.artist==='Drake')||tracks[0];
  if(!track) throw Error('No result');
  const a=await ctx.extractAudioUrl(track.id);
  if(!a.ok) throw Error(a.error.message);
  const audio=JSON.parse(a.data);
  output.push({track,audio:{title:audio.title,artist:audio.artist,durationSeconds:audio.durationSeconds}});
 }
 console.log(JSON.stringify(output));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
