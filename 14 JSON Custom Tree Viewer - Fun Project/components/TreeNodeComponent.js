const TreeNodeComponent = ({node})=>{
    console.log('wooo');
    return (<div style={{marginLeft:'40px'}}>
        {/* <b>{node.name}</b> */}
       <a target="_blank" href={node.html_url}><b>{node.name}</b></a> 
        
    </div>)
}

export default TreeNodeComponent