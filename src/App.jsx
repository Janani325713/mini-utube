import React, { useState,useEffect } from "react";
import "./App.css"
const API_KEY = "AIzaSyBKAwRsRlrMubek1nDzPsdYwB-Emm_NtWk";

function App() {
  const [search, setSearch]=useState("");
  const [videos, setVideos]=useState([]);
  const [selectedVideo, setSelectedVideo]=useState(null);
  const [loading, setLoading]=useState(false);
  const [nextToken,setNextToken] = useState("")
  const [mode,setMode] = useState("home")

// ============================================================home===================================================================
//   function Home(){
//      if(loading) return   // prevent multiple calls
//     setVideos([])
//        setNextToken("")
//    setLoading(true)
//    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=IN&key=${API_KEY}`)
//   .then(res=>res.json())
//   .then(data => {
//     const shuffle = data.items.sort(() => Math.random() - 0.5)
//      setVideos(shuffle) 
//         setNextToken(data.nextPageToken) 
     
//   })
   
// }
 function Home(){
     if(loading) return   // prevent multiple calls
    setMode("home")
    setVideos([])
    setNextToken("")
   setLoading(true)
   fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&pageToken=${nextToken}&regionCode=IN&key=${API_KEY}`)
  .then(res=>res.json())
  .then(data => {
    const shuffle = data.items.sort(() => Math.random() - 0.5)
     setVideos(prev => [...prev, ...shuffle]) 
    setNextToken(data.nextPageToken)
     
  })
}
   
  // ============================================================seach=====================================================================
  const ManageSearch = async() => {
    if (!search.trim()) return;
    setMode("search")
    setLoading(true);
    setVideos([])
    setNextToken("")
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&pageToken=${nextToken}&q=${search}&key=${API_KEY}`
      );
      console.log(response)
      const data = await response.json();
      console.log(data); 
      if (data.items) {
      
       setVideos(data.items)
       setNextToken(data.nextPageToken)
      } else {
        console.log("No videos found");
        setVideos([]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };
  

// ==========================================================scroll =================================================================

  useEffect(() => {
  Home()
 }, [])


useEffect(() => {

 const handleScroll = () => {

  if (
   window.innerHeight + window.scrollY >=
   document.documentElement.scrollHeight - 150 &&
   !loading
  ) {

   if(mode === "home"){
      loadMoreHome()
   }
   else{
      loadMoreSearch()
   }

  }

 }

 window.addEventListener("scroll", handleScroll)

 return () => window.removeEventListener("scroll", handleScroll)

}, [nextToken,mode])

// ================================================================================================================
function loadMoreHome(){

 setLoading(true)

 fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&pageToken=${nextToken}&regionCode=IN&key=${API_KEY}`)
 .then(res => res.json())
 .then(data => {
  const shuffle = data.items.sort(() => Math.random() - 0.5)
  setVideos(prev => [...prev, ...shuffle])
  setNextToken(data.nextPageToken)
  setLoading(false)
 })

}
// =============================================================================================================================
function loadMoreSearch(){
 setLoading(true)
 fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${search}&pageToken=${nextToken}&key=${API_KEY}`)
 .then(res => res.json())
 .then(data => {
  setVideos(prev => [...prev, ...data.items])
  setNextToken(data.nextPageToken)
  setLoading(false)
 })

}
    

  return (
    <div className="w-full">

  {/* --------------------------------------------------NAVBAR-------------------------------------------------------------------- */}

      <nav className="flex items-center justify-between bg-white shadow px-6 py-2 fixed top-0 left-0 w-full z-50">
        <h1 className="text-2xl font-bold text-gray-800">MINITUBE</h1>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className=" border px-3 py-2 rounded"/>
          <button onClick={ManageSearch} className="bg-blue-500 text-white px-4 py-2 rounded"> Search</button>
      </nav>
  {/* --------------------------------------------SIDEBAR---------------------------------------------------------------------------- */}
      
      <div className="flex">
        <div className=" w-56 bg-white h-screen shadow p-4 fixed">
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          <ul>
            <li onClick={Home} className="hover:text-blue-600 ">Home</li>
            <li className="hover:text-blue-600 ">Profile</li>
            <li className="hover:text-blue-600">Settings</li>
            <li className="hover:text-blue-600 ">Logout</li>
          </ul>
        </div>

  {/* -----------------------------------------------------MAIN CONTENT--------------------------------------------------------------------------- */}

        <div  className="ml-56 pt-20 p-6 min-h-screen">
          {loading && <p>Loading...</p>}

          {selectedVideo && (
            <div className="mb-6">
              <iframe width="100%" height="400" src={`https://www.youtube.com/embed/${selectedVideo}`}></iframe>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id.videoId} onClick={() => setSelectedVideo(video.id.videoId)}>
                <img src={video.snippet.thumbnails.medium.url} alt="videos"className="w-full"/>
                <div className="p-2">
                  <h3 className="text-sm font-bold">{video.snippet.title}</h3>
                  <p className="text-xs text-gray-500">{video.snippet.channelTitle}</p>
                </div>
              </div>
             ))} 
           </div> 
        </div>
      </div>
    </div>
  );
}

export default App;

