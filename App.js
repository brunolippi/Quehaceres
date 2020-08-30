import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "./Colors";
import tempData from './tempData';
import TodoList from './components/TodoList'
import AddListModal from './components/AddListModal'
import Fire from './Fire'

export default class App extends React.Component {
  
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true
  }
  
  componentDidMount() {
    firebase = new Fire((error, user) => {
      if(error){
        return alert("Uh, oh, algo malió sal !")
      }

      firebase.getLists(lists => {
        this.setState({ lists, user }, () => {
          this.setState({ loading: false })
        })
      })

      this.setState({ user })
    })
  }

  toggleAddTodoModal() {
    this.setState({addTodoVisible: !this.state.addTodoVisible})
  }
  
  renderList = list => {
    return <TodoList list={list} updateList={this.updateList} deleteList={this.deleteList} />
  }

  addList = list => {
    firebase.addList({
      name: list.name,
      color: list.color,
      todos: []
    })
  };

  updateList = list => {
    firebase.updateList(list);
  };

  deleteList = list => {
    firebase.deleteList(list);
  };

  componentWillUnmount() {
    firebase.detach();
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' color={colors.blue} />
          <Text style={styles.add}>Cargando...</Text>
        </View>
      )
    } else{
      return (
        <View style={styles.container}>
  
          <Modal animationType="slide" visible={this.state.addTodoVisible} onRequestClose={() => this.toggleAddTodoModal}>
            <AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
          </Modal>
  
  
          <View style={{ flexDirection: "row" }}>
            <View style={styles.divider} />
            <Text style={styles.title}>
              Que
              <Text style={{ fontWeight: "300", color: colors.blue }}>
                haceres
              </Text>
            </Text>
            <View style={styles.divider} />
          </View>
  
          <View style={{ marginVertical: 48 }}>
            <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodoModal()}>
              <AntDesign name="plus" size={16} color={colors.blue} />
              <Text style={styles.add}>Agregar</Text>
            </TouchableOpacity>
          </View>
  
          <View style={{ height: 275, paddingHorizontal: 10 }}>
            <FlatList
              data={this.state.lists}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => this.renderList(item)}
              keyboardShouldPersistTaps="always"
            />
          </View>
        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 52,
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 10,
    marginTop: 8,
  },
});
