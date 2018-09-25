/**
 * Internal dependencies
 */

import { escapeHTML, escapeAttribute } from '@wordpress/escape-html';

/**
 * Internal dependencies
 */

import { toTree } from './to-tree';

/**
 * Create an HTML string from a Rich Text value. If a `multilineTag` is
 * provided, text separated by two new lines will be wrapped in it.
 *
 * @param {Object} value        Rich text value.
 * @param {string} multilineTag Multiline tag.
 *
 * @return {string} HTML string.
 */
export function toHTMLString( value, multilineTag ) {
	const tree = toTree( value, multilineTag, {
		createEmpty,
		append,
		getLastChild,
		getParent,
		getType,
		isText,
		getText,
		remove,
		appendText,
	} );

	return createChildrenHTML( tree.children );
}

function createEmpty( type ) {
	return { type };
}

function getLastChild( { children } ) {
	return children && children[ children.length - 1 ];
}

function append( parent, object ) {
	if ( typeof object === 'string' ) {
		object = { text: object };
	}

	object.parent = parent;
	parent.children = parent.children || [];
	parent.children.push( object );
	return object;
}

function appendText( object, text ) {
	object.text += text;
}

function getParent( { parent } ) {
	return parent;
}

function getType( { type } ) {
	return type;
}

function isText( { text } ) {
	return typeof text === 'string';
}

function getText( { text } ) {
	return text;
}

function remove( object ) {
	const index = object.parent.children.indexOf( object );

	if ( index !== -1 ) {
		object.parent.children.splice( index, 1 );
	}

	return object;
}

function createElementHTML( { type, attributes, object, children } ) {
	let attributeString = '';

	for ( const key in attributes ) {
		attributeString += ` ${ key }="${ escapeAttribute( attributes[ key ] ) }"`;
	}

	if ( object ) {
		return `<${ type }${ attributeString }>`;
	}

	return `<${ type }${ attributeString }>${ createChildrenHTML( children ) }</${ type }>`;
}

function createChildrenHTML( children = [] ) {
	return children.map( ( child ) => {
		return child.text === undefined ? createElementHTML( child ) : escapeHTML( child.text );
	} ).join( '' );
}