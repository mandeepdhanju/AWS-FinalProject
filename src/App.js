import { useEffect, useState, useRef } from 'react'
import * as amplify from './amplify'
import { Authenticator, Alert, useAuthenticator, Loader, Flex, Button, TextField, Divider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineDeleteForever } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import MyModal from './components/MyModal.js'
import Header from './components/Header'
import Footer from './components/Footer'

Amplify.configure(awsExports);

const Login = () =>
  <div className='wrapper'>
    <Header />
    <Authenticator className='login-container' />
    <Footer />
  </div>;

const Home = () => {

  const [file, setFile] = useState(null)
  const [posts, setPosts] = useState([])
  const [description, setDescription] = useState("")

  const [isLoading, setIsLoading] = useState({})
  const [isPostLoading, setIsPostLoading] = useState(false)
  
  const [updatedDescription, setUpdatedDescription] = useState({})
  const [errorLandingMsg, setLandingErrorMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [text, setText] = useState({})
  const [comments, setComments] = useState({})
  const [comment, setComment] = useState({})
  const [isOpen, setIsOpen] = useState({});
  const [isUpdateOpen, setIsUpdateOpen] = useState({});
  const [post, setPost] = useState({});
  const [isFormOn, setIsFormOn] = useState(false)
  const imageInputRef = useRef()

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    async function getPosts() {
      try {
        const result = await amplify.getPosts()
        const sortedResult = result.sort((a, b) => new Date(b.created) - new Date(a.created))
        console.log(sortedResult)
        setPosts(sortedResult)
        setLandingErrorMsg("")
      } catch (error) {
        setLandingErrorMsg(error)
        setPosts([])
      }
    }
    getPosts()
  }, [])

  const createPost = async (e) => {
    e.preventDefault()
    setIsPostLoading(true)
    try {
      const post = await amplify.createPost(description, file)
      const newPost = post
      newPost["imageUrl"] = await amplify.getImage(post.imageName)
      console.log(newPost)
      setPost({ ...newPost })
      setIsPostLoading(false)
      setPosts([newPost, ...posts])
      setDescription("")
      imageInputRef.current.value = ""
      setFile(null)
      setErrorMsg("")
    } catch {
      setErrorMsg("You cant create it.")
      setIsPostLoading(false)
    }
  }
  const updatePost = async (postId) => {
    setIsPostLoading(true)
    const post = posts.find(item => item.id == postId)
    try {
      const updatedPost = await amplify.updatePost(postId, updatedDescription[postId])
      post.description = updatedDescription[postId]
      console.log(updatedPost)
      setPosts([...posts])
      setErrorMsg("")
      setIsPostLoading(false)
    } catch (error) {
      setErrorMsg("You cant update it.")
      console.log(error)
      setIsPostLoading(false)
    }
  };
  
  const showUpdateModal = (postId) => {
    const oldIsUpdateOpen = isUpdateOpen
    oldIsUpdateOpen[postId] = true
    setIsUpdateOpen({ ...oldIsUpdateOpen })
    console.log(isLoading[postId])
  }
  const hideUpdateModal = (postId) => {
    const oldIsUpdateOpen = isUpdateOpen
    oldIsUpdateOpen[postId] = false
    setIsUpdateOpen({ ...oldIsUpdateOpen })
  };
  const inputDescription = (postId, e) => {
    const oldDescription = updatedDescription
    oldDescription[postId] = e.target.value
    setUpdatedDescription({ ...oldDescription })
  };

  const deletePost = async (postId) => {
    try {
      const result = await amplify.deletePost(postId)
      console.log(result)
      if (result.message == "deleted successfully") {
        const newPosts = posts.filter(item => item.id != postId)
        setPosts(newPosts)
        setErrorMsg("")
      }
    } catch {
      setErrorMsg("You cant delete it.")
    }
  }
  const hideModal = (postId) => {
    const oldIsOpen = isOpen
    oldIsOpen[postId] = false
    setIsOpen({ ...oldIsOpen })
  };

  const hideLoading = (postId) => {
    const oldIsLoading = isLoading
    oldIsLoading[postId] = false
    setIsLoading({ ...oldIsLoading })
  };

  const showLoading = (postId) => {
    const oldIsLoading = isLoading
    oldIsLoading[postId] = true
    setIsLoading({ ...oldIsLoading })
  };

  const createComment = async (postId) => {
    showLoading(postId)
    try {
      const result = await amplify.createComment(postId, text[postId])
      console.log(result)
      const oldComment = comment
      oldComment[postId] = result
      console.log(oldComment)
      setComment({ ...oldComment })
      const post = posts.find(item => item.id == postId)
      post.commentCount += 1
      setPosts([...posts])
      setErrorMsg("")
      setText({})
      hideLoading(postId)
    } catch {
      setErrorMsg("You can not comment it.")
      hideLoading(postId)
    }
  }

  const inputText = (postId, e) => {
    const oldText = text
    oldText[postId] = e.target.value
    setText({ ...oldText })
  };

  const getComments = async (postId) => {
    const result = await amplify.getComments(postId)
    console.log(result)
    const oldComments = comments
    oldComments[postId] = result
    // console.log(oldComments)
    setComments({ ...oldComments })
    const oldIsOpen = isOpen
    oldIsOpen[postId] = true
    setIsOpen({ ...oldIsOpen })
  }

  const fileSelected = event => {
    const file = event.target.files[0]
    setFile(file)
  }

  return (
    <div className='wrapper'>
      <Header createOn={() => setIsFormOn(true)} user={user} handleClick={signOut} />
      <MyModal title="Create a post for my movie" isOpen={isFormOn} hideModal={() => setIsFormOn(false)}>
        <form onSubmit={createPost}>
          <input onChange={fileSelected} type="file" accept="image/*" ref={imageInputRef}></input>
          <TextField label="Description" isMultiline={true}
            laceholder="Description"
            onChange={e => setDescription(e.target.value)}
            className='text-field'
            value={description}
          />
          <Button type="submit" className="submit-btn" >Upload</Button>
        </form>
        {isPostLoading && <Loader className="my-loader" />}
      </MyModal>

      <section>
        {posts ? posts.map((item) => <div key={item.id} className="post-card">
          <div className='post-head'>
            <div className='profile-box'>
              <CgProfile className='profile-icon'></CgProfile>
              <p>{item.PK.slice(5)}</p>
            </div>

            {item.PK.slice(5) == user.username && <div className='icon-box'>
              <BiEditAlt className='edit-icon' onClick={() => showUpdateModal(item.id)}></BiEditAlt>
              <MdOutlineDeleteForever className='delete-icon' onClick={() => deletePost(item.id)}>Delete</MdOutlineDeleteForever>
            </div>}
          </div>
          <MyModal title="Update the Description" isOpen={isUpdateOpen[item.id]} hideModal={() => hideUpdateModal(item.id)}>
            <div>
              <div className='img-box'>
                <img src={item.imageUrl} alt="My movie"></img>
              </div>
              <TextField label="Description" isMultiline={true}
                onChange={e => inputDescription(item.id, e)}
                className='text-field'
                value={updatedDescription[item.id] || item.description}
              />
              <Button type="submit" className="submit-btn" onClick={() => updatePost(item.id)} >Update</Button>
            </div>
            {isPostLoading && <Loader className="my-loader" />}
          </MyModal>
          <div className='img-box'>
            <img src={item.imageUrl} alt="My movie"></img>
          </div>
          <div className="info">
            <p className='description'>{item.description}</p>
            {item.commentCount > 0 && <Button variation="link" onClick={() => getComments(item.id)}>View all {item.commentCount} comments</Button>}
            <p className='date'>{item.created.substring(0, 10)}</p>
          </div>
          <MyModal title="View all comments" isOpen={isOpen[item.id]} hideModal={() => hideModal(item.id)}>
            {comments[item.id] && comments[item.id].map((comment, index) => <div>
              <p key={index}><CgProfile className='profile'></CgProfile> {comment.username}: {comment.text}</p>
              <Divider size="small" className='divider' />
            </div>)}
          </MyModal>
          {comment[item.id] && <p className='new-comment'>{comment[item.id].username}: {comment[item.id].text}</p>}
          <Flex>
            <TextField label="Default" labelHidden={true} placeholder="Add a comment"
              onChange={e => inputText(item.id, e)} value={text[item.id] || ""}
              outerEndComponent={<Button onClick={() => createComment(item.id)} disabled={!text[item.id]}>Comment</Button>}
            />
          </Flex>
          {isLoading[item.id] && <Loader variation="linear" />
          }
        </div>) :
          <Alert variation="info">{errorLandingMsg}</Alert>
        }
      </section>
      <Footer />
    </div>
  )
}

function App() {
  const { route } = useAuthenticator((context) => [context.route]);
  return route === 'authenticated' ? <Home /> : <Login />;
}

export default function AppWithProvider() {
  return (
    <Authenticator.Provider>
      <App>
      </App>
    </Authenticator.Provider>
  );
}

