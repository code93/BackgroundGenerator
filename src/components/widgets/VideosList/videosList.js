import React, { Component } from 'react';
import styles from './videosList.css';
import { firebaseLooper, firebaseVideos } from '../../../firebase';

import Button from '../Buttons/buttons';
import VideosListTemplate from './videosListTemplate'

class VideosList extends Component {

    state = {
        videos:[],
        start: this.props.start,
        end: this.props.start + this.props.amount,
        amount: this.props.amount
    }

    componentWillMount(){
        this.request(this.state.start, this.state.end)
    }

    request = (start, end) => {
        if(this.state.videos.length < 1) {
            firebaseVideos.once('value')
            .then((snapshot)=>{
                const videos = firebaseLooper(snapshot);
                this.setState({
                    videos
                })
            })
        }

        firebaseVideos.orderByChild('id').startAt(start).endAt(end).once('value')
         .then((snapshot)=>{
             const videos = firebaseLooper(snapshot);
             this.setState({
                videos:[...this.state.videos, ...videos],
                     start,
                     end
             })
         })
         .catch(e=>{
             console.log(e)
         })

    }

    renderVideos = () => {
        let template = null;

        switch(this.props.type){
            case('card'):
                template = <VideosListTemplate data={this.state.videos} id={this.state.id} />
            break;
            default:
                template = null
        }
        return template;
    }

    loadMore = () => {
        let end = this.state.end + this.state.amount;
        this.request(this.state.end + 1, end)
    }

    renderButton = () => {
        return this.props.loadmore ? 
        <Button 
            type="loadmore"
            loadMore={()=> this.loadMore()}
            cta="Load More Videos"
        />
        :
        <Button type="linkTo" cta="More videos" linkTo="/videos"/>
    }

    renderTitle = () => {
        return this.props.title ? 
        <h3><strong>Videos</strong></h3>
        : null
    }


render(){
    return(
        <div className={styles.videoList_wrapper}>
            { this.renderTitle() }
            { this.renderVideos() }
            { this.renderButton() }
        </div>
    )
}
}

export default VideosList;