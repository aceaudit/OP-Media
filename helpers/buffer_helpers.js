// Paste into the Buffer tab (publish.buffer.com, logged in as ownpacedaily@gmail.com) with javascript_tool.
// Then: window.__P = <contents of pending_B.json>; and call __mk(p, 'instagram'|'tiktok'|'youtube') per post.
window.__g = async (query, variables = {}) => { const r = await fetch('https://graph.buffer.com/', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json', 'x-buffer-client-id': 'webapp-publishing' }, body: JSON.stringify({ query, variables }) }); return r.json(); };
window.__ch = { instagram: '6ad249cf778b240e2f2af802', tiktok: '6ad24a77778b240e2f2b137c', youtube: '6ad24a01778b240e2f2af9b1' };
// account check (must be ownpacedaily@gmail.com / org 6ad2499a9875b16fa0d06ee2):
// await __g(`query { account { email currentOrganization { id name } } }`)
window.__mk = async (p, svc) => {
  const base = 'https://buffer-media-uploads.s3.amazonaws.com/6ad2499a9875b16fa0d06ee2/';
  // no thumbnailUrl: Buffer then renders the cover at thumbnailOffset (images.buffer.com)
  const input = { channelId: __ch[svc], text: svc === 'instagram' ? p.ig : svc === 'tiktok' ? p.tt : p.yt, dueAt: p.dueAt, mode: 'customScheduled', schedulingType: 'automatic', needsApproval: false,
    assets: [{ video: { url: base + p.mediaId + '_transcoded.mp4', metadata: { thumbnailOffset: p.offset, title: p.title } } }] };
  if (svc === 'instagram') input.metadata = { instagram: { type: 'reel', shouldShareToFeed: true, isAiGenerated: false } };
  if (svc === 'youtube') input.metadata = { youtube: { title: p.ytTitle, categoryId: '22', privacy: 'public', madeForKids: false, notifySubscribers: true, embeddable: true, license: 'youtube', isAiGenerated: false } };
  if (svc === 'tiktok') input.metadata = { tiktok: { isAiGenerated: false } };
  const r = await __g(`mutation($i: CreatePostInput!){ createPost(input:$i){ __typename ... on PostActionSuccess { post { id dueAt channelService } } ... on MutationError { message } } }`, { i: input });
  return r.errors ? { err: r.errors } : r.data.createPost;
};
