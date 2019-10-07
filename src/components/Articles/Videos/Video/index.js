import React, {Component} from 'react';
import { firebaseDB, firebaseLooper, firebaseVideos } from '../../../../firebase';

import styles from '../../articles.css';
import VideosRelated from '../../../widgets/VideosList/VideosRelated/videosRelated';


class VideoArticle extends Component {

    state = {
        article: [],
        related:[]
    }

    componentWillMount(){
        firebaseDB.ref(`videos/${this.props.match.params.id}`).once('value')
        .then((snapshot)=>{
            let article = snapshot.val();

            
                 this.setState({
                     article
                 })
                 this.getRelated();
             })
        // axios.get(`${URL}/videos?id=${this.props.match.params.id}`)
        // .then( response => {
        //     let article = response.data[0];

        //     axios.get(`${URL}/teams?id=${article.team}`)
        //     .then( response => {
        //         this.setState({
        //             article,
        //             team:response.data
        //         });
        //         this.getRelated();
        //     })


        // })
    }

    getRelated = () => {
             firebaseVideos
             .limitToFirst(3).once('value')
             .then((snapshot)=>{
                 const related = firebaseLooper(snapshot);
                 this.setState({
                     related
                 })
             })
         
        // axios.get(`${URL}/teams`)
        // .then( response =>{

        //     let teams = response.data

        //     axios.get(`${URL}/videos?q=${this.state.team[0].city}&_limit=3`)
        //     .then( response => {
        //             this.setState({
        //                 teams,
        //                 related: response.data
        //             })
        //     })
        // })

    }


    render(){
        const article = this.state.article;

        return(
            <div>
            
                <div className={styles.videoWrapper}>
                    <h1>{article.title}</h1>
                    <iframe
                        title="videoplayer"
                        width="100%"
                        height="300px"
                        src={`https://www.youtube.com/embed/${article.url}`}
                    >

                    </iframe>
                </div>
                <VideosRelated 
                data={this.state.related}
               />

            </div>
        )
    }


}

export default VideoArticle;