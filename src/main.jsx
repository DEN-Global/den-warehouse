import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import './style.css';
class ErrorBoundary extends React.Component {state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<main className="loading"><h1>We couldn’t open this workspace.</h1><p>Reload the page to reconnect. Your saved data remains on the server.</p><button onClick={()=>location.reload()}>Reload</button></main>:this.props.children;}}
createRoot(document.getElementById('root')).render(<ErrorBoundary><App/></ErrorBoundary>);
