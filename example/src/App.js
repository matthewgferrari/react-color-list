import React, { useState } from "react"
import './App.css';
import ColorList from "react-color-list"
import {
	LiveProvider,
	LiveEditor,
	LiveError,
	LivePreview
} from 'react-live'
import theme from "prism-react-renderer/themes/nightOwl";
import { useSnackbar } from "notistack"



var examples = [{
	code: `function App() {
  const [colors, setColors] = useState(["#bf4040","#ab3f3f","#9f3737","#8d3434","#812929"])
  return (
      <div style={{ width: "2rem", padding: "2rem" }}>
		<ColorList colors = {colors} onChange={(c) => setColors(c)} disableAlpha/>
      </div>
  );
}`,
	title: "Basic"
},
{
	code: `function App() {
  const [colors, setColors] = useState(["#011f4b","#03396c","#005b96","#6497b1","#b3cde0"])
  return (
      <div style={{ width: "2rem", padding: "2rem" }}>
		<ColorList colors = {colors} onChange={(c) => setColors(c)} animationLength={.5} animationOffset = {.5} loadFromLeft flipAddButton />
      </div>
  );
}`,
	title: "Initial Animation and Direction"
},
{
	code: `function App() {
  const [colors, setColors] = useState(["hsl(10,20%,50%)","hsl(50,10%,60%)","hsl(100,28%,21%)","hsl(312,60%,10%)"])
  return (
      <div style={{ width: "2rem", padding: "2rem" }}>
		<ColorList colors = {colors} onChange={(c) => setColors(c)} colorFormat = "hsl" defaultColor = "hsla(216,91%,56%,.8)"/>
      </div>
  );
}`,
	title: "Dynamic Color Format with Custom Default Color"
},
{
	code: `function App() {
  const [colors, setColors] = useState(["#ee4035", "#fdf498", "#7bc043","#0392cf"])
  return (
      <div style={{ width: "2rem", padding: "2rem" }}>
		<ColorList colors = {colors}  maxColors = {4} minColors = {4} 
		onChange={(c, e) => {
			setColors(c)
			sendNotification(e)
		}} 
		onMaxColorsReached={(c) => sendError(\`Max colors reached: \${c}\`)} 
		onMinColorsReached={(c) => sendError(\`Min colors reached: \${c}\`)}
		/>
      </div>
  );
}`,
	title: "Color Limits and Callbacks"
},
{
	code: `function App() {
  const [colors, setColors] = useState(["rgb(191,64,64)","rgb(171,63,63)","rgb(159,55,55)","rgb(141,52,52)"])
  return (
      <div style={{ width: "2rem", padding: "2rem" }}>
		<ColorList colors = {colors} colorFormat = "rgb"  onChange={(c) => setColors(c)} 
		swatchLabelColor={(c)=>{
			//c is the color of the swatch 
			return "#"+Math.floor(Math.random()*16777215).toString(16)
		}}
		swatchActiveBorderColor={(c)=>{
			//c is the color of the swatch 
			return "#"+Math.floor(Math.random()*16777215).toString(16)
		}}
		/>
      </div>
  );
}`,
	title: "Custom Accent Colors"
},
{
	code: `function App() {
  const [colors, setColors] = useState(["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"])
  return (
      <div style={{ width: "2rem", padding: "2rem" }}>
		<ColorList colors = {colors}  onChange={(c) => setColors(c)} 
		AddButton={({addColor})=>{
			//c is the color of the swatch 
			return <button onClick = {()=>addColor()}>Fancy Add Button</button>
		}}
		RemoveButton={({removeColor})=>{
			//c is the color of the swatch 
			return <button onClick = {()=>removeColor()}>Fancy Remove Button</button>
		}}
		SaveButton={({saveColor})=>{
			//c is the color of the swatch 
			return <button onClick = {()=>saveColor()}>Fancy Save Button</button>
		}}
		/>
      </div>
  );
}`,
	title: "Custom Buttons"
}
]

const HeaderList = () => {
	const [colors, setColors] = useState(["#4c837e", "#7ec49e", "#ffad2e"])
	const { enqueueSnackbar } = useSnackbar();
	return (
		<ColorList colors={colors} onChange={(c) => setColors(c)}
			colorFormat="rgb"
			flipAddButton
			loadFromLeft
			onMaxColorsReached={() => enqueueSnackbar("You cannot have more than 5 colors", { variant: 'error', preventDuplicate: true })}
			onMinColorsReached={() => enqueueSnackbar("You cannot have less than 3 colors", { variant: 'error', preventDuplicate: true })}
			maxColors={5}
			minColors={3}
		/>
	)
}

function App() {
	const { enqueueSnackbar } = useSnackbar();


	const sendNotification = (text) => {
		enqueueSnackbar(text, { variant: 'info' })
	}

	const sendError = (text) => {
		enqueueSnackbar(text, { variant: 'error', preventDuplicate: true })
	}

	return (
		<div className="App" style={{ marginTop: "2rem" }}>
			<div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: ".75rem" }}>
				<HeaderList />

				<div style={{ paddingLeft: ".75rem" }}>
					<h1 style={{ padding: "0", margin: "0", fontSize: "2.5rem" }}>React-Color-List</h1>
					<h3 style={{ padding: "0", margin: "0" }}>A full color palette manager for React</h3>
				</div>
			</div>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: ".5rem" }}>
				<svg
					style={{ marginRight: ".5rem" }}
					xmlns="http://www.w3.org/2000/svg"
					width={30}
					height={30}
					viewBox="0 0 438.549 438.549"
				>
					<path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" />
				</svg>
        @<a style={{ marginRight: ".5rem" }} href="https://github.com/matthewgferrari/react-color-list">matthewgferrari/react-color-list</a>
        |
        <svg
					width={50}
					height={20}
					style={{ marginRight: ".5rem", marginLeft: ".5rem" }}
					viewBox="0 0 256 100"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="xMinYMin meet"
				>
					<path d="M0 0v85.498h71.166V99.83H128V85.498h128V0H0z" fill="#CB3837" />
					<path
						d="M42.502 14.332h-28.17v56.834h28.17V28.664h14.332v42.502h14.332V14.332H42.502zm42.996 0v71.166h28.664V71.166h28.17V14.332H85.498zM128 56.834h-13.838v-28.17H128v28.17zm56.834-42.502h-28.17v56.834h28.17V28.664h14.332v42.502h14.332V28.664h14.332v42.502h14.332V14.332h-57.328z"
						fill="#FFF"
					/>
				</svg>

        @<a href="https://www.npmjs.com/package/react-color-list">react-color-list</a>
			</div>

			{
				examples.map((code, index) => {
					return (
						<div key={index} style={{ marginLeft: "50px", marginRight: "50px", marginBottom: "2rem" }}>
							<h1 style={{ textAlign: "center", marginBottom: ".5rem" }}>{code.title}</h1>
							<LiveProvider code={code.code} scope={{ ColorList, useState, sendNotification, sendError }} theme={theme} >
								<div className="wrapper">
									<div className="editor">
										<LiveEditor className="editorInner" />
									</div>
									<LivePreview className="preview" />
								</div>
								<LiveError className="error" />
							</LiveProvider>
						</div>
					)
				})
			}
		</div>
	);
}

export default App;
