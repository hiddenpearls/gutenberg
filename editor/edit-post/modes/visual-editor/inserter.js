/**
 * External dependencies
 */
import { connect } from 'react-redux';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { IconButton, withContext } from '@wordpress/components';
import { Component, compose } from '@wordpress/element';
import { createBlock, BlockIcon } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { Inserter } from '../../../components';
import { insertBlock } from '../../../store/actions';
import { getFrequentInserterItems, getBlockCount, getBlocks } from '../../../store/selectors';

export class VisualEditorInserter extends Component {
	constructor() {
		super( ...arguments );

		this.showControls = this.toggleControls.bind( this, true );
		this.hideControls = this.toggleControls.bind( this, false );

		this.state = {
			isShowingControls: false,
		};
	}

	toggleControls( isShowingControls ) {
		this.setState( { isShowingControls } );
	}

	insertItem( { name, initialAttributes } ) {
		const { onInsertBlock } = this.props;
		onInsertBlock( createBlock( name, initialAttributes ) );
	}

	render() {
		const { blockCount, isLocked } = this.props;
		const { isShowingControls } = this.state;
		const { frequentInserterItems } = this.props;
		const classes = classnames( 'editor-visual-editor__inserter', {
			'is-showing-controls': isShowingControls,
		} );

		if ( isLocked ) {
			return null;
		}

		return (
			<div
				className={ classes }
				onFocus={ this.showControls }
				onBlur={ this.hideControls }
			>
				<Inserter
					insertIndex={ blockCount }
					position="top right" />
				{ frequentInserterItems.map( ( item ) => (
					<IconButton
						key={ 'frequently_used_' + item.name }
						className="editor-inserter__block"
						onClick={ () => this.insertItem( item ) }
						label={ sprintf( __( 'Insert %s' ), item.title ) }
						disabled={ item.isDisabled }
						icon={ (
							<span className="editor-visual-editor__inserter-block-icon">
								<BlockIcon icon={ item.icon } />
							</span>
						) }
					>
						{ item.title }
					</IconButton>
				) ) }
			</div>
		);
	}
}

export default compose(
	withContext( 'editor' )( ( settings ) => {
		const { templateLock, blockTypes } = settings;

		return {
			isLocked: !! templateLock,
			enabledBlockTypes: blockTypes,
		};
	} ),
	connect(
		( state, ownProps ) => {
			return {
				frequentInserterItems: getFrequentInserterItems( state, ownProps.enabledBlockTypes ),
				blockCount: getBlockCount( state ),
				blocks: getBlocks( state ),
			};
		},
		{ onInsertBlock: insertBlock },
	),
)( VisualEditorInserter );
