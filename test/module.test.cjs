const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'../modules/ytmusic/index.js'),'utf8');
const id='abcdefghijk';
function runtime(handler) {
  const calls=[];
  const ctx=vm.createContext({fetch:async (url,options)=>{
    calls.push({url,body:JSON.parse(options.body)});
    return {ok:true,status:200,json:async()=>handler(url,JSON.parse(options.body))};
  }});
  vm.runInContext(code,ctx);
  return {ctx,calls};
}
const decode=x=>JSON.parse(x.data);
test('required handlers, no undocumented radio capability',()=>{
 const {ctx}=runtime(()=>({}));
 for(const k of ['searchResults','extractDetails','extractTracks','extractAudioUrl']) assert.equal(typeof ctx[k],'function');
 assert.equal(ctx.getRadioCandidates,undefined);
});
test('invalid or foreign identity performs no network call',async()=>{
 const {ctx,calls}=runtime(()=>({}));
 for(const input of ['', 'wrong', 'other:song:'+id]) assert.equal((await ctx.extractAudioUrl(input)).ok,false);
 assert.equal(calls.length,0);
});
test('explicit playback restriction fails without another client attempt',async()=>{
 const {ctx,calls}=runtime(()=>({playabilityStatus:{status:'LOGIN_REQUIRED'}}));
 assert.equal((await ctx.extractAudioUrl(id)).ok,false);
 assert.equal(calls.length,1);
 assert.equal('contentCheckOk' in calls[0].body,false);
 assert.equal('racyCheckOk' in calls[0].body,false);
});
test('wrong recording is rejected',async()=>{
 const {ctx}=runtime(()=>({playabilityStatus:{status:'OK'},videoDetails:{videoId:'wrongwrong1'},streamingData:{adaptiveFormats:[{url:'https://example.com/audio',mimeType:'audio/mp4'}]}}));
 assert.equal((await ctx.extractAudioUrl(id)).ok,false);
});
test('matching recording resolves ephemeral audio with headers',async()=>{
 const {ctx}=runtime(()=>({playabilityStatus:{status:'OK'},videoDetails:{videoId:id},streamingData:{adaptiveFormats:[{url:'https://example.com/audio',mimeType:'audio/mp4',bitrate:128000}]}}));
 const result=await ctx.extractAudioUrl(id);
 assert.equal(result.ok,true);
 assert.equal(decode(result).url,'https://example.com/audio');
 assert.deepEqual(decode(result).headers,{});
});
test('details never return stream URLs',async()=>{
 const {ctx}=runtime(()=>({playabilityStatus:{status:'OK'},videoDetails:{videoId:id,title:'日本語',author:'Artist'},streamingData:{hlsManifestUrl:'https://example.com/private'}}));
 const result=await ctx.extractDetails(id);
 assert.equal(result.ok,true);
 assert.equal(decode(result).title,'日本語');
 assert.equal(JSON.stringify(result).includes('/private'),false);
});
test('search fixture parses title and artist without stream data',async()=>{
 const item={playlistItemData:{videoId:id},flexColumns:[
 {musicResponsiveListItemFlexColumnRenderer:{text:{runs:[{text:'Stay who you are'}]}}},
 {musicResponsiveListItemFlexColumnRenderer:{text:{runs:[{text:'GOHOBI'},{text:' • '},{text:'Album'}]}}}
 ]};
 const {ctx}=runtime(()=>({contents:{tabbedSearchResultsRenderer:{tabs:[{tabRenderer:{content:{sectionListRenderer:{contents:[{musicShelfRenderer:{contents:[{musicResponsiveListItemRenderer:item}]}}]}}}}]}}}));
 const result=decode(await ctx.searchResults('GOHOBI',0));
 assert.equal(result.length,1);
 assert.equal(result[0].artist,'GOHOBI');
 assert.equal(result[0].id,'synthetiq_ytmusic_direct:song:'+id);
 assert.equal(result[0].url,undefined);
});
test('pagination and unsupported album listing are honest and bounded',async()=>{
 const {ctx,calls}=runtime(()=>({}));
 assert.deepEqual(decode(await ctx.searchResults('Drake',1)),[]);
 assert.equal((await ctx.extractTracks('album')).ok,false);
 assert.equal(calls.length,0);
});
test('no key/token placeholders or access confirmation flags shipped',()=>{
 assert.equal(/AIza|__YTM_API_KEY__|USER_TOKEN|racyCheckOk|contentCheckOk/.test(code),false);
});
