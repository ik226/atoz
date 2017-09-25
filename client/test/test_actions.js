import { expect } from 'chai';
import { Map, List, fromJS } from 'immutable';
import {
  INITIAL_STATE,
  addMarker,
  removeMarker,
  toggleMarker,
  closeInfoWindow,
  removePhoto,
  addPhoto,
  deletePhoto
} from '../src/actions/actions';
import { v4 } from 'uuid';

describe('actions test', () => {
  it('add photo', () => {

    const state = INITIAL_STATE;
    const photoId = v4();
    const markerId = v4();
    const position = {lat: '1', lng: '1'};
    const stateWithMarker = addMarker(state, position, markerId);
    expect(stateWithMarker.get('markers')).to.include.keys(markerId);
    expect(stateWithMarker.getIn(['markers', markerId, 'position']))
      .to.equal(position);
    const nextState = addPhoto(stateWithMarker, markerId, photoId);
    expect(nextState.get('photos')).to.include.keys(photoId);
    expect(nextState.getIn(['markers', markerId, 'photos']))
      .to.include(photoId);
    expect(nextState.getIn(['photos', photoId, 'marker']))
      .to.equal(markerId);
  });

  it('delete photo', () => {
    const state = INITIAL_STATE;
    const photoId = v4();
    const markerId = v4();
    const position = {lat: '1', lng: '1'};
    const stateWithMarker = addMarker(state, position, markerId);

    const stateWithPhoto = addPhoto(stateWithMarker, markerId, photoId);
    const nextState = deletePhoto(stateWithPhoto, photoId);
    expect(nextState.getIn(['markers', markerId, 'photos']))
      .to.have.sizeOf(0);
    expect(nextState.getIn(['photos']))
      .to.not.include.keys(photoId);
    expect(nextState.getIn(['photos']))
      .to.have.sizeOf(0);

  })
})
