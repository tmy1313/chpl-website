import React, {useState} from 'react';
import {arrayOf, func, shape, string} from 'prop-types';
import {getAngularService} from './';

import {ChplActionBar} from '../action-bar/';

const dependencies = {
  getChplLogService: () => require('../../services/services-bridge.jsx').default,
};

function ChplFuzzyType ({fuzzyType, takeAction}) {
  const [choices, setChoices] = useState(fuzzyType.choices);
  const [isAdding, setAdding] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [newFuzzyType, setNewFuzzyType] = useState(undefined);
  const $log = getAngularService('$log');
  const chplLog = dependencies.getChplLogService();

  const act = action => {
    switch (action) {
    case 'cancel':
      cancel();
      break;
      //no default
    }
  };

  const cancel = () => {
    setEditing(false);
    setChoices(fuzzyType.choices);
    setNewFuzzyType(undefined);
    takeAction(fuzzyType, 'cancel');
  };

  const edit = () => {
    chplLog.info('edit');
    setEditing(true);
    takeAction(fuzzyType, 'edit');
  };

  const handleAdd = () => {
    setChoices([].concat(choices).concat(newFuzzyType));
    setAdding(false);
    setNewFuzzyType(undefined);
  };

  const handleChange = event => {
    setNewFuzzyType(event.target.value);
  };

  const remove = choice => {
    $log.info({choice});
    setChoices(choices.filter(c => c !== choice));
  };

  return (
    /* eslint-disable indent,react/jsx-indent */
    <div id={'fuzzy-type-' + fuzzyType.fuzzyType}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4 className="panel-title">{fuzzyType.fuzzyType}</h4>
        </div>
        <div className="panel-body">
          {isEditing ? (
            <>
              Choices (for editing)
              <form onSubmit={() => {}}>
                <ul>
                  {
                    choices
                    .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
                    .map(choice => (
                      <li key={choice}>
                        {choice}
                        <button onClick={() => remove(choice)}><i className="fa fa-trash"></i></button>
                      </li>
                    ))
                  }
                </ul>
              </form>
              {isAdding ? (
                <>
                  <label>
                    Add new Fuzzy Type
                    <input type="text" onChange={handleChange} />
                  </label>
                  <button className="btn btn-primary" id="add-fuzzy-type" onClick={handleAdd}>Save</button>
                  <button className="btn btn-default" id="cancel-add-fuzzy-type" onClick={() => setAdding(false)}>Cancel</button>
                </>
              ) : (
                <button className="btn" id="add-fuzzy-type" onClick={() => setAdding(true)}><i className="fa fa-plus"></i> Add</button>
              ) }
              <ChplActionBar
                errorMessages={['1', '2']}
                warningMessages={['a', 'b']}
                takeAction={act}
              />
            </>
          ) : (
            <>
              <span className="pull-right">
                <button className="btn btn-link btn-small" id={'fuzzy-type-' + fuzzyType.fuzzyType + '-edit'} onClick={() => edit()}><i className="fa fa-pencil-square-o"></i><span className="sr-only"> Edit Fuzzy Type</span></button>
              </span>
              Choices
              <ul>
                {
                  choices
                  .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
                  .map(choice => (
                    <li key={choice}>{choice}</li>
                  ))
                }
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export {ChplFuzzyType};

ChplFuzzyType.propTypes = {
  fuzzyType: shape({
    fuzzyType: string,
    choices: arrayOf(string),
  }),
  takeAction: func,
};
