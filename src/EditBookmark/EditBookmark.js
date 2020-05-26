import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
// import './EditBookmark.css';

const Required = () => (
    <span className="EditBookmark__required">*</span>
)

class EditBookmark extends Component {
    static propTypes = {
        match: PropTypes.shape({
          params: PropTypes.object,
        }),
        history: PropTypes.shape({
          push: PropTypes.func,
        }).isRequired,
    };

    static contextType = BookmarksContext;

    state = {
        error: null,
        id: '',
        title: '',
        url: '',
        rating: 1,
        description: '',
    };

    componentDidMount() {
        const { bookmarkId } = this.props.match.params
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.API_KEY}`
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => Promise.reject(error))
            }
            return res.json()
        })
        .then(responseData => {
            this.setState({
                id: responseData.id,
                title: responseData.title,
                url: responseData.url,
                rating: responseData.rating,
                description: responseData.description,
            })
        })
        .catch(error => {
            console.error(error)
            this.setState({ error })
        })
    }

    handleChangeTitle = e => {
        this.setState({ title: e.target.value })
    };

    handleChangeUrl = e => {
        this.setState({ url: e.target.value })
    };

    handleChangeRating = e => {
        this.setState({ rating: e.target.value })
    };

    handleChangeDescription = e => {
        this.setState({ description: e.target.value })
    };

    handleSubmit = e => {
        e.preventDefault()
        const { bookmarkId } = this.props.match.params
        const { id, title, url, rating, description } = this.state
        const newBookmark = { id, title, url, rating, description }
        fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify(newBookmark),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
            },
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => Promise.reject(error))
            }
        })
        .then(() => {
            this.resetFields(newBookmark)
            this.context.updateBookmark(newBookmark)
            this.props.history.push('/')
        })
        .catch(error => {
            console.error(error)
            this.setState({ error })
        })
    }

    resetFields = (newFields) => {
        this.setState({
            id: newFields.id || '',
            title: newFields.title || '',
            url: newFields.url || '',
            description: newFields.description || '',
            rating: newFields.rating || '',
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/')
    }
    
    render() {
        const { error, title, url, rating, description } = this.state
        return (
            <section className='EditBookmark'>
            <h2>Edit bookmark</h2>
            <form
              className='EditBookmark__form'
              onSubmit={this.handleSubmit}
            >
              <div className='EditBookmark__error' role='alert'>
                {error && <p>{error.message}</p>}
              </div>
              <input
                type='hidden'
                name='id'
              />
              <div>
                <label htmlFor='title'>
                  Title
                  {' '}
                  <Required />
                </label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  placeholder='Great website!'
                  required
                  value={title}
                  onChange={this.handleChangeTitle}
                />
              </div>
              <div>
                <label htmlFor='url'>
                  URL
                  {' '}
                  <Required />
                </label>
                <input
                  type='url'
                  name='url'
                  id='url'
                  placeholder='https://www.great-website.com/'
                  required
                  value={url}
                  onChange={this.handleChangeUrl}
                />
              </div>
              <div>
                <label htmlFor='description'>
                  Description
                </label>
                <textarea
                  name='description'
                  id='description'
                  value={description}
                  onChange={this.handleChangeDescription}
                />
              </div>
              <div>
                <label htmlFor='rating'>
                  Rating
                  {' '}
                  <Required />
                </label>
                <input
                  type='number'
                  name='rating'
                  id='rating'
                  min='1'
                  max='5'
                  required
                  value={rating}
                  onChange={this.handleChangeRating}
                />
              </div>
              <div className='EditBookmark__buttons'>
                <button type='button' onClick={this.handleClickCancel}>
                  Cancel
                </button>
                {' '}
                <button type='submit'>
                  Save
                </button>
              </div>
            </form>
          </section>
        );
    }
}

export default EditBookmark;