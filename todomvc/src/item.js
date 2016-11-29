import Component from 'inferno-component';
import { ESCAPE, ENTER, isEqual } from './share';

export default class Item extends Component {
	constructor({data, ...props}) {
		super(props);
		this.todo = data;
		this.state = {text: data.title};
	}

	componentWillReceiveProps = ({data}) => this.setText(data.title);
	shouldComponentUpdate = ({data}, {text}) => !(isEqual(data, this.todo) && text === this.state.text);
	componentWillUpdate = ({data}) => (this.todo = data);
	componentDidUpdate = () => this.editor.focus();

	setText = text => this.setState({text});

	render({doToggle, doDelete, doSave, onBlur, onFocus}, {text}) {
		const {title, completed, editing} = this.todo;

		const cls = [];
		editing && cls.push('editing');
		completed && cls.push('completed');

		const handler = e => {
			if (e.which === ESCAPE) return onBlur();
			if (e.which === ENTER) return doSave(text);
		}

		return (
			<li className={ cls.join(' ') }>
				<div className="view">
					<input className="toggle" type="checkbox"
						checked={ completed } onclick={ doToggle }
					/>

					<label ondblclick={ onFocus }>{ title }</label>

					<button className="destroy" onclick={ doDelete }></button>
				</div>

				<input className="edit"
					ref={el => { this.editor = el }}
					value={ editing && text }
					onblur={ onBlur } onkeydown={ handler }
					oninput={ e => this.setText(e.target.value) }
				/>
			</li>
		);
	}
}
