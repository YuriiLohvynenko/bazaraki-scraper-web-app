import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

const rootPath = 'https://polypropylene.website/bazarakiscraper/dat';

export default class Thumbnails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photoIndex: 0,
            isOpen: false,
        };

        this.sources = props.thumbnails.map(t => t.path.substr(0, 4) === 'http' ? t.path : rootPath +"/"+ t.path);
    }

    render() {
        const { photoIndex, isOpen } = this.state;

        return (
            <div>
                {this.props.thumbnails.map((t, i) =>
                    <a href={t.path.substr(0, 4) === 'http' ? t.path : rootPath +"/"+ t.path} key={t.path} onClick={(e) => {
                        this.setState({photoIndex: i, isOpen: true});
                        e.preventDefault();
                    }}>
                        <img src={t.path.substr(0, 4) === 'http' ? t.path : rootPath +"/"+ t.path} alt="" className="thumb" />
                    </a>
                )}

                {isOpen && (
                    <Lightbox
                        mainSrc={this.sources[photoIndex]}
                        nextSrc={this.sources[(photoIndex + 1) % this.sources.length]}
                        prevSrc={this.sources[(photoIndex + this.sources.length - 1) % this.sources.length]}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + this.sources.length - 1) % this.sources.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % this.sources.length,
                            })
                        }
                    />
                )}
            </div>
        );
    }
}