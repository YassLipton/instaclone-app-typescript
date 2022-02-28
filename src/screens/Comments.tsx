import React, { useEffect, useReducer, useState } from 'react';
import { Dimensions, StyleSheet, Image, TouchableOpacity, Button, ActivityIndicator, ScrollView } from 'react-native';
import { Text, View } from '../elements';
import mufc from '../../assets/images/mufc.jpg'
import profile from '../../assets/images/profile.jpg'
import like from '../../assets/images/like.png'
import liked from '../../assets/images/liked.png'
import ThemeContext from '../context/theme-context';
import { RouteProp } from '@react-navigation/native';
import { Comment, Post } from '../models';
import AuthContext from '../context/auth-context';

const Comments = (props: {
  route: RouteProp<{ 
    params: { 
      post: Post,
      postIndex: number,
      LikeComment: (postIndex: number, commentIndex: number) => void,
      DislikeComment: (postIndex: number, commentIndex: number) => void
    } 
  }, 'params'>
}) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  const { userInfos } = React.useContext(AuthContext)
  const { theme } = React.useContext(ThemeContext)
  const { card } = theme.colors
  const { post, postIndex, LikeComment, DislikeComment } = props.route.params
  // const comments: Comment[] = post.comments

  const [comments, setComments] = useState<Comment[]>(post.comments)

  // useEffect(() => console.log('comments props', props), [comments])

  const Like_A_Comment = async (postIndex: number, commentIndex: number) => {
    LikeComment(postIndex, commentIndex)
    // if (!comments[commentIndex].usersWhoLiked.find(id => id == userInfos!._id)) comments[commentIndex].usersWhoLiked.push(userInfos!._id)
    // setComments(comments)
    forceUpdate()
  }

  const Dislike_A_Comment = async (postIndex: number, commentIndex: number) => {
    DislikeComment(postIndex, commentIndex)
    comments[commentIndex].usersWhoLiked.splice(comments[commentIndex].usersWhoLiked.indexOf(userInfos!._id))
    setComments(comments)
    forceUpdate()
  }

  return (
    <View style={styles.container} isCard>
      <View style={styles.mainCommentContainer}>
        <View style={styles.mainCommentImageBox}>
          <Image style={styles.mainCommentImage} source={{uri: post.user.profilePicUrl}} />
        </View>
        <View style={styles.mainCommentTextBox}>
          <Text style={styles.mainCommentText}><Text style={styles.textStrong}>{post.user.username}</Text> {post.caption}</Text>
          <Text style={styles.mainCommentTime}>4j</Text>
        </View>
      </View>
    {
      comments && comments.map((comment: Comment, commentIndex: number) => (
        <View style={styles.commentContainer} key={commentIndex}>
          <View style={styles.commentImageBox}>
            <Image style={styles.commentImage} source={{uri: comment.user.profilePicUrl}} />
          </View>
          <View style={styles.commentTextBox}>
            <Text style={styles.commentText}><Text style={styles.textStrong}>{comment.user.username}</Text> {comment.text}</Text>
            <View style={styles.commentActions}>
              <Text style={styles.commentTime}>1j</Text>
              <Text style={styles.commentActionText}>{comment.usersWhoLiked.length} J'aime</Text>
              <Text style={styles.commentActionText}>Répondre</Text>
            </View>
          </View>
          <View style={styles.commentLikeBox}>
          {
            comment.usersWhoLiked.find(id => id == userInfos?._id) !== undefined
            ?
            <TouchableOpacity onPress={() => Dislike_A_Comment(postIndex, commentIndex)}>
              <Image style={styles.commentLikeImage} source={liked} />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => Like_A_Comment(postIndex, commentIndex)}>
              <Image style={styles.commentLikeImage} source={like} />
            </TouchableOpacity>
          }
          </View>
        </View>
      ))
    }
    </View>
  )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  mainCommentContainer: {
    width: Dimensions.get('window').width,
    padding: 12,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb'
  },
  mainCommentImageBox: {
    width: 50,
    height: '100%'
  },
  mainCommentImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  mainCommentTextBox: {
    width: Dimensions.get('window').width - 40 - 24,
    flexDirection: 'column'
  },
  textStrong: {
    fontWeight: 'bold'
  },
  mainCommentText: {
    marginTop: 2,
    marginBottom: 2,
  },
  mainCommentTime: {
    marginTop: 4,
    color: '#8e8e8e'
  },
  commentContainer: {
    width: Dimensions.get('window').width,
    padding: 12,
    flexDirection: 'row'
  },
  commentImageBox: {
    width: 50,
    height: '100%'
  },
  commentImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  commentTextBox: {
    width: Dimensions.get('window').width - 70 - 24,
    flexDirection: 'column'
  },
  commentText: {
    marginTop: 2,
    marginBottom: 2,
  },
  commentActions: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  commentTime: {
    marginRight: 12,
    color: '#8e8e8e',
    fontSize: 13
  },
  commentActionText: {
    fontWeight: 'bold',
    color: '#8e8e8e',
    marginRight: 12,
    fontSize: 13
  },
  commentLikeBox: {
    width: 30,
    height: '100%',
    paddingTop: 10
  },
  commentLikeImage: {
    width: 14,
    height: 14
  }
});

export default Comments