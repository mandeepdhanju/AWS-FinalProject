import Amplify, { API, Storage } from "aws-amplify"
import awsExports from "./aws-exports"


Amplify.configure(awsExports)

const apiName = 'moviesListApp'

function randomString(bytes = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(b => b.toString(16)).join("")
}

export async function getImage(name) {
  const url = await Storage.get(name);
  return url;
}

export async function getMovies() {
  const path = '/movies' 
  const result = await API.get(apiName, path)
  return await Promise.all(result.Items.map(async item => {
    const imageUrl = await Storage.get(item.imageName);
    return {  
      ...item,
      imageUrl
    }
  }))
}


export async function getComments(movieId) {
  const path = `/movies/${movieId}/comments`
  const comments = await API.get(apiName, path)
  return comments.Items
}

export async function createMovies(description, imageName) {
  // export async function createMovies(description, file) {
  const { key } = await Storage.put(randomString(), file);
  // debugger
  const path = '/movies' 
  const result = await API.post(apiName, path, {
    body: {
       description,
        imageName 
      }
  })
  console.log(result)
  return result
}

export async function updateMovie(complete, id) {
    const path = '/movies/' + id
    const result = await API.patch(apiName, path, {
      body: { complete }
    })
   console.log(result)
    return result.movie
  }

  export async function deleteMovie(id) {
    const path = '/movies/' + id 
    const result = await API.del(apiName, path, {
     // body: { title }
    })
   // console.log(result)
    return result.movie
  }
  

  // export async function createComment(movieId, text) {
  //   const path = `/posts/${movieId}/comments`
  //   const result = await API.movie(apiName, path, {
  //     body: { 
  //       text
  //     }
  //   })
  //   console.log(result)
  //   return result
  // }
  
  export async function uploadImage(file) {
    const result = await Storage.put(randomString(), file);
    return result
  }
  
